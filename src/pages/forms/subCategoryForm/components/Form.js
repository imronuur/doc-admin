import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { Card, Grid, TextField, Select, FormHelperText, MenuItem, FormLabel } from '@mui/material';

// routes
//

import { Validations } from './Validations';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

SubCategoryNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCategory: PropTypes.object,
  handleSubCategoryCreate: PropTypes.func,
  loading: PropTypes.bool,
  categories: PropTypes.array,
  currentSubCategory: PropTypes.object
};

export default function SubCategoryNewForm({
  isEdit,
  categories,
  currentSubCategory,
  handleSubCategoryCreate,
  loading
}) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentSubCategory?.name || '',
      slug: currentSubCategory?.slug || '',
      parent: currentSubCategory?.parent?._id || ''
    },
    validationSchema: Validations,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        handleSubCategoryCreate(values);
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
                label="Sub Category Name"
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Select A Parent Category</FormLabel>
              <Select fullWidth {...getFieldProps('parent')}>
                {categories.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error sx={{ m: '2%' }}>
                {touched.parent && errors.parent}
              </FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={loading}>
                {!isEdit ? 'Create Sub Category' : 'Save Changes'}
              </LoadingButton>
            </Grid>
          </Grid>
        </Card>
      </Form>
    </FormikProvider>
  );
}
