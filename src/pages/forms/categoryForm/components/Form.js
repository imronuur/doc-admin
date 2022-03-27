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

CategoryNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCategory: PropTypes.object,
  handleCategoryCreate: PropTypes.func,
  loading: PropTypes.bool
};

export default function CategoryNewForm({ isEdit, currentCategory, handleCategoryCreate, loading }) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentCategory?.name || '',
      slug: currentCategory?.slug || ''
    },
    validationSchema: Validations,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        handleCategoryCreate(values);
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
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category Name"
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={loading}>
                {!isEdit ? 'Create Category' : 'Save Changes'}
              </LoadingButton>
            </Grid>
          </Grid>
        </Card>
      </Form>
    </FormikProvider>
  );
}
