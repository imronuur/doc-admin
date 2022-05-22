import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { Card, Grid, TextField } from '@mui/material';

// routes
//

import { Validations } from './Validations';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

CouponNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCategory: PropTypes.object,
  handleSubCategoryCreate: PropTypes.func,
  loading: PropTypes.bool
};

export default function CouponNewForm({ isEdit, currentCoupons, handleCouponCreate, loading }) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentCoupons?.name || '',
      expiryDate: currentCoupons?.expiryDate || '',
      discount: currentCoupons?.discount || '',
      _id: currentCoupons?._id
    },
    validationSchema: Validations,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        handleCouponCreate(values);
        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, touched, handleSubmit, getFieldProps, values } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Coupon Name"
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                {...getFieldProps('expiryDate')}
                error={Boolean(touched.expiryDate && errors.expiryDate)}
                helperText={touched.expiryDate && errors.expiryDate}
                type="date"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Discount"
                {...getFieldProps('discount')}
                error={Boolean(touched.discount && errors.discount)}
                helperText={touched.discount && errors.discount}
              />
            </Grid>
            <Grid item xs={12}>
              <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={loading}>
                {!isEdit ? 'Create coupon' : 'Save Changes'}
              </LoadingButton>
            </Grid>
          </Grid>
        </Card>
      </Form>
    </FormikProvider>
  );
}
