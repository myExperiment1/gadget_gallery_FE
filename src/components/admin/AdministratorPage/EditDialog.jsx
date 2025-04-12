import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import api from '../../../constants/api';
import { setAlertActionCreator } from '../../../states/alert/action';
import { asyncGetWarehouseAdmin } from '../../../states/Administrator/action';

export function EditDialog({ isOpen, onClose, editData, email }) {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      warehouseDestination: 0,
    },
    onSubmit: async () => {
      try {
        const { id } = formik.values.warehouseDestination;
        await api.patch(`/warehouseusers/${id}`, {
          whAdminEmail: email,
        });
        dispatch(asyncGetWarehouseAdmin());
        onClose();
        dispatch(
          setAlertActionCreator({
            val: {
              status: 'success',
              message: 'success edit  warehouse admin',
            },
          })
        );
      } catch (err) {
        dispatch(setAlertActionCreator({ err }));
      }
    },
  });
  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        onClose();
        formik.resetForm();
      }}
    >
      <DialogTitle>Edit Warehouse Admin</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {`Move ${editData?.User?.firstName} from warehouse: ${editData?.Warehouse?.name} to warehouse: `}
        <WarehouseEditSelect formik={formik} />
      </DialogContent>

      <DialogActions>
        <Button onClick={formik.handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
/* Warehouse Edit Select */
function WarehouseEditSelect({ formik }) {
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchWarehouses = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/warehouses');
      const res = data.data;
      setWarehouses(res);
      setIsLoading(false);
    } catch (err) {
      dispatch(setAlertActionCreator({ err }));
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <Autocomplete
      id="warehouse-select"
      sx={{ width: 300, mt: 5 }}
      options={isLoading ? [{ name: 'loading...' }] : warehouses}
      autoHighlight
      getOptionLabel={(option) => option.name || ''}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      value={formik.values.warehouseDestination}
      onChange={(e, value) => {
        formik.setFieldValue('warehouseDestination', value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a Warehouse"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
