import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Autocomplete, Grid, Stack, TextField, Select, MenuItem, FormLabel, FormHelperText } from '@mui/material';

import { Validations } from './Validations';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

OffersForm.propTypes = {
  isEdit: PropTypes.bool,
  currentOffer: PropTypes.object,
  handleCreate: PropTypes.func,
  loading: PropTypes.bool
};

export default function OffersForm({ isEdit, currentOffer, products, handleCreate, loading }) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: currentOffer?.title || '',
      subTitle: currentOffer?.subTitle || '',
      product: currentOffer?.product,
      expiryDate: currentOffer?.expiryDate || '',
      price: currentOffer?.price || 0,
      _id: currentOffer?._id
    },
    validationSchema: Validations,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        handleCreate(values);
        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;
  console.log(values);
  const product = products?.data?.map((product) => product);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Grid item xs={12}>
                  {' '}
                  <Autocomplete
                    onChange={(event, newValue) => {
                      setFieldValue('product', newValue?._id);
                    }}
                    options={product}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Product" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    {...getFieldProps('title')}
                    error={Boolean(touched.title && errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Sub Title"
                    {...getFieldProps('subTitle')}
                    error={Boolean(touched.subTitle && errors.subTitle)}
                    helperText={touched.subTitle && errors.subTitle}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Price"
                    {...getFieldProps('price')}
                    error={Boolean(touched.price && errors.price)}
                    helperText={touched.price && errors.price}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormLabel>Expiry Date</FormLabel>
                  <TextField
                    fullWidth
                    {...getFieldProps('expiryDate')}
                    error={Boolean(touched.expiryDate && errors.expiryDate)}
                    helperText={touched.expiryDate && errors.expiryDate}
                    type="date"
                  />
                </Grid>
              </Stack>
              <Grid item xs={12} mt={2} my={2}>
                <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={loading}>
                  {!isEdit ? 'Create Offer' : 'Save Changes'}
                </LoadingButton>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
