import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { bool, func, number } from 'prop-types';
import { object, number as num } from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import FormikOutlinedInput from '../../../FormikOutlinedInput';
import {
  asyncGetProduct,
  asyncUpdateWarehouseProductStock,
} from '../../../../states/product/action';
import QuantityInput from './QuantityInput';
import { asyncGetProducts } from '../../../../states/products/action';
import useSwal from '../../../../hooks/useSwal';

function UpdateStockDialog({
  productId,
  isUpdateStockDialogOpen,
  setIsUpdateStockDialogOpen,
}) {
  const product = useSelector((states) => states.product);
  const dispatch = useDispatch();
  const { warehouseId } = useParams();
  const [searchParams] = useSearchParams();
  const [warehouseProduct, setWarehouseProduct] = useState(null);
  const Swal = useSwal();

  useEffect(() => {
    dispatch(asyncGetProduct(productId));
  }, [productId]);

  useEffect(() => {
    if (product !== null) {
      setWarehouseProduct(
        product.WarehouseProducts.find(
          (val) => val.warehouseId === Number(warehouseId)
        )
      );
    }
  }, [product]);

  const initialValues = useMemo(() => ({ quantity: 0 }), []);

  const validationSchema = useMemo(() => {
    if (warehouseProduct !== null) {
      return object({
        quantity: num()
          .integer()
          .min(warehouseProduct.stock * -1)
          .required(),
      });
    }
    return null;
  }, [warehouseProduct]);

  const onSubmit = async (values, { resetForm }) => {
    await Swal.fire({
      icon: 'warning',
      title: (
        <Typography>
          {`Stok ${product.name} akan`}
          <Typography
            component="span"
            sx={{ fontWeight: 600, '&::before': { content: '" "' } }}
          >
            {`${values.quantity > 0 ? 'ditambah' : 'dikurangi'} ${Math.abs(
              values.quantity
            )}`}
          </Typography>
        </Typography>
      ),
      showDenyButton: true,
      denyButtonText: 'Batalkan',
      showConfirmButton: true,
      confirmButtonText: 'Konfirmasi',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const isSuccess = await dispatch(
          asyncUpdateWarehouseProductStock({
            productId: product.id,
            warehouseId: warehouseProduct.warehouseId,
            quantity: values.quantity,
          })
        );
        if (isSuccess) {
          resetForm();
          setIsUpdateStockDialogOpen(false);
          await dispatch(
            asyncGetProducts({
              getType: 'REPLACE',
              search: searchParams.get('search'),
              categoryId: searchParams.get('categoryId'),
              sortBy: searchParams.get('sortBy'),
              orderBy: searchParams.get('orderBy'),
              paranoid: false,
              page: searchParams.get('page'),
              perPage: searchParams.get('perPage'),
              warehouseId,
            })
          );
        }
      },
    });
  };

  if (warehouseProduct === null) return null;

  return (
    <Dialog fullWidth open={isUpdateStockDialogOpen}>
      <Formik
        validateOnMount
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>
              Update Stok Produk
            </DialogTitle>
            <DialogContent>
              <Typography p={2} fontWeight={600}>
                {product.name}
              </Typography>
              <Stack spacing={2} py={2}>
                <FormikOutlinedInput
                  name="current-stock"
                  label="Stok saat ini"
                  inputProps={{
                    value: warehouseProduct.stock,
                    readOnly: true,
                    type: 'number',
                    inputProps: { min: 0 },
                    startAdornment: (
                      <InputAdornment position="start">📦</InputAdornment>
                    ),
                  }}
                />
                <QuantityInput warehouseProduct={warehouseProduct} />
                <FormikOutlinedInput
                  name="new-stock"
                  label="Stok terbaru"
                  inputProps={{
                    value: warehouseProduct.stock + formik.values.quantity,
                    readOnly: true,
                    type: 'number',
                    inputProps: { min: 0, max: 1, step: 0.01 },
                    startAdornment: (
                      <InputAdornment position="start">📦</InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!formik.isValid || !formik.dirty}
              >
                Simpan
              </Button>
              <Button
                onClick={() => setIsUpdateStockDialogOpen(false)}
                variant="contained"
                color="error"
              >
                Batal
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

UpdateStockDialog.propTypes = {
  productId: number.isRequired,
  isUpdateStockDialogOpen: bool.isRequired,
  setIsUpdateStockDialogOpen: func.isRequired,
};

export default UpdateStockDialog;
