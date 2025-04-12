import {
  Box,
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
import { mixed, number, object, string, array } from 'yup';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { bool, func } from 'prop-types';
import { useMemo } from 'react';
import FormikOutlinedInput from '../../FormikOutlinedInput';
import ImageInput from './ImageInput';
import {
  asyncCreateProduct,
  asyncGetProducts,
} from '../../../states/products/action';
import CategoriesInput from './CategoriesInput';
import FormikReactQuill from '../../FormikReactQuill';
import useSwal from '../../../hooks/useSwal';

function CreateDialog({ isCreateDialogOpen, setIsCreateDialogOpen }) {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const Swal = useSwal();

  const initialValues = useMemo(
    () => ({
      name: '',
      price: 0,
      weight: 0,
      discount: 0,
      description: '',
      categoryIds: [],
      images: [],
    }),
    []
  );

  const validationSchema = useMemo(
    () =>
      object({
        name: string().required(),
        price: number().integer().min(0).required(),
        weight: number().min(0).required(),
        discount: number().min(0).max(1).required(),
        description: string().required(),
        categoryIds: array().of(number().integer().min(1)),
        images: array()
          .of(
            mixed()
              .required()
              .test(
                'is-file',
                'Image must be a file',
                (value) => value instanceof File
              )
              .test('is-image', 'File must be an image', (value) =>
                value.type.startsWith('image/')
              )
              .test(
                'file-size',
                'File size must be ≤ 1MB',
                (value) => value.size <= 1024 * 1024 // 1MB = 1024 * 1024 bytes
              )
          )
          .min(1)
          .required(),
      }),
    []
  );

  const onSubmit = async (values, { resetForm }) => {
    await Swal.fire({
      icon: 'warning',
      title: (
        <Typography>
          Produk
          <Typography
            component="span"
            sx={{ fontWeight: 600, '&::before, &::after': { content: '" "' } }}
          >
            {values.name}
          </Typography>
          akan ditambahkan
        </Typography>
      ),
      showDenyButton: true,
      denyButtonText: 'Batalkan',
      showConfirmButton: true,
      confirmButtonText: 'Konfirmasi',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('price', values.price);
        formData.append('weight', values.weight);
        formData.append('discount', values.discount);
        formData.append('description', values.description);
        formData.append('categoryIds', JSON.stringify(values.categoryIds));
        values.images.forEach((image) => {
          formData.append('images', image);
        });
        const isSuccess = await dispatch(asyncCreateProduct(formData));
        if (isSuccess) {
          await dispatch(
            asyncGetProducts({
              getType: 'REPLACE',
              search: searchParams.get('search'),
              categoryId: searchParams.get('categoryId'),
              sortBy: searchParams.get('sortBy'),
              paranoid: false,
              orderBy: searchParams.get('orderBy'),
              page: searchParams.get('page'),
              perPage: searchParams.get('perPage'),
            })
          );
          resetForm();
          setIsCreateDialogOpen(false);
        }
      },
    });
  };

  return (
    <Dialog fullWidth open={isCreateDialogOpen}>
      <Formik
        validateOnMount
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>
              Masukkan Data Produk
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2} py={2}>
                <FormikOutlinedInput name="name" label="Nama" />
                <FormikOutlinedInput
                  name="price"
                  label="Harga"
                  inputProps={{
                    type: 'number',
                    inputProps: { min: 0, step: 1 },
                    startAdornment: (
                      <InputAdornment position="start">Rp</InputAdornment>
                    ),
                  }}
                />
                <FormikOutlinedInput
                  name="weight"
                  label="Berat"
                  inputProps={{
                    type: 'number',
                    inputProps: { min: 0 },
                    endAdornment: (
                      <InputAdornment position="end">gr</InputAdornment>
                    ),
                  }}
                />
                <FormikOutlinedInput
                  name="discount"
                  label="Diskon"
                  inputProps={{
                    type: 'number',
                    inputProps: { min: 0, max: 1, step: 0.01 },
                    endAdornment: (
                      <InputAdornment position="end">
                        {`≈ ${new Intl.NumberFormat('id-ID', {
                          style: 'percent',
                        }).format(formik.values.discount)}`}
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ '& .ql-tooltip': { position: 'sticky' } }}>
                  <FormikReactQuill name="description" label="Deskripsi" />
                </Box>
                <ImageInput />
                <CategoriesInput />
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
                onClick={() => setIsCreateDialogOpen(false)}
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

CreateDialog.propTypes = {
  isCreateDialogOpen: bool.isRequired,
  setIsCreateDialogOpen: func.isRequired,
};

export default CreateDialog;
