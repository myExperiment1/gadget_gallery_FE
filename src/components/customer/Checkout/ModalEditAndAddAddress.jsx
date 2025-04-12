import { Button, Dialog, useMediaQuery, useTheme } from '@mui/material';
import * as React from 'react';
import Slide from '@mui/material/Slide';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { HeaderModal } from '../../HeaderModal';
import ProvinceSelect from './ModalEditOrAddAddress/ProvinceSelect';
import CitySelect from './ModalEditOrAddAddress/CitySelect';
import {
  addressInitialValues,
  addressSubmit,
  addressValidationSchema,
} from './ModalEditOrAddAddress/formikAddressSetUp';
import { AddressNameAndReciever } from './ModalEditOrAddAddress/AddressNameAndReceiverForm';
import { PostalCodeDistrictVillageDetailsForm } from './ModalEditOrAddAddress/PostalCodeDistrictVillageDetailsForm';
import { setAlertActionCreator } from '../../../states/alert/action';
import { asyncGetAddress } from '../../../states/Address/action';

const handleError = (error, dispatch) => {
  console.log(error);
  dispatch(
    setAlertActionCreator({
      val: { status: 'error', message: error?.response?.data?.message },
    })
  );
};

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export function ModalEditAndAddAddress({
  open,
  setOpen,
  addressToEdit,
  address,
  addresses,
  setAddress,
  setAddresses,
}) {
  const authUser = useSelector((state) => state.authUser);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const [disableButton, setDisableButton] = useState(false);
  const userSelector = useSelector((state) => state.authUser);

  const [location, setLocation] = useState({ latitude: null, longitude: null });
  addressInitialValues.latitude = location.latitude;
  addressInitialValues.longitude = location.longitude;

  const addressFormik = useFormik({
    initialValues:
      open === 'EDIT ADDRESS' ? addressToEdit : addressInitialValues,
    validationSchema: addressValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await addressSubmit(
          values,
          userSelector?.id,
          addresses,
          setAddresses,
          setAddress,
          addressToEdit,
          address,
          dispatch
        );

        if (window.location.pathname === '/user/address')
          if (authUser?.id) dispatch(asyncGetAddress({ userId: authUser?.id }));
        // page /user/address
        // dispatch(
        //   setAlertActionCreator({
        //     val: { status: 'success', message: 'success' }, // tambahan(nazhif)
        //   })
        // );
        setOpen('CHOOSE_ADDRESS');
        addressFormik.resetForm();
      } catch (error) {
        handleError(error, dispatch);
      }
    },
  });

  function handleClose() {
    setOpen('CHOOSE_ADDRESS');
    addressFormik.resetForm();
  }

  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          dispatch(
            setAlertActionCreator({
              val: { status: 'error', message: error?.message },
            })
          );
        }
      );
    } else {
      dispatch(
        setAlertActionCreator({
          val: {
            status: 'error',
            message: 'Geolocation is not supported by your browser',
          },
        })
      );
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div>
      <Dialog
        open={open === 'ADD ADDRESS' || open === 'EDIT ADDRESS'}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose()}
        fullScreen={fullScreen}
        fullWidth
        aria-describedby="alert-dialog-slide-description"
        scroll="paper"
      >
        <div className="sticky-top">
          <HeaderModal handleClose={() => handleClose()} Title={open} />
        </div>
        <div className="my-3 px-3 d-flex flex-column gap-2">
          <AddressNameAndReciever addressFormik={addressFormik} />
          <div>
            <div className="d-flex gap-2">
              <ProvinceSelect addressFormik={addressFormik} />
              <CitySelect addressFormik={addressFormik} />
            </div>
            <div>{addressFormik.errors.provinceId}</div>
          </div>
          <div>
            <PostalCodeDistrictVillageDetailsForm
              addressFormik={addressFormik}
            />
          </div>
        </div>
        <Button
          disabled={disableButton}
          onClick={() => {
            setDisableButton(true);
            addressFormik.handleSubmit();
            setTimeout(() => {
              setDisableButton(false);
            }, 1500);
          }}
        >
          <h5>Save</h5>
        </Button>
      </Dialog>
    </div>
  );
}
