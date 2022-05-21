import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, TextField } from '@mui/material';

import { Validations } from './Validations';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ClientsForm.propTypes = {
  isEdit: PropTypes.bool,
  currentClient: PropTypes.object,
  handleCreate: PropTypes.func,
  loading: PropTypes.bool
};

export default function ClientsForm({ isEdit, currentClient, handleCreate, loading }) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentClient?.name || '',
      address: currentClient?.address || '',
      email: currentClient?.email || '',
      phone: currentClient?.phone || '',
      company: currentClient?.company || '',
      _id: currentClient?._id
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

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Full Name"
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    type="email"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                    type="tel"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Grid>
                <Grid item xs={12} mt>
                  <TextField fullWidth label="Company" {...getFieldProps('company')} />
                </Grid>
              </Stack>
              <Grid item xs={12} mt={2} my={2}>
                <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={loading}>
                  {!isEdit ? 'Create Client' : 'Save Changes'}
                </LoadingButton>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
