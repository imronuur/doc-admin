import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik, FieldArray } from 'formik';
// material
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { Validations } from './Validations';
import { permissionsList } from './permissions';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

CategoryNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentRole: PropTypes.object,
  handleCreate: PropTypes.func,
  loading: PropTypes.bool
};

export default function CategoryNewForm({ isEdit, currentRole, handleCreate, loading }) {
  const [fileLoading, setFileLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentRole?.name || '',
      permissions: currentRole?.permissions || [],
      _id: currentRole?._id,
      permissionId: []
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

  const handlePermissionCheck = (checked, value) => {
    if (checked) {
      const index = values.permissions.indexOf(value);
      if (index < 0) {
        values.permissions.push(value);
      }
    } else {
      const index = values.permissions.indexOf(value);
      if (index > -1) {
        values.permissions.splice(index, 1);
      }
    }
    console.log(values);
  };

  const handleParentPermissionCheck = (checked, value, id) => {
    console.log({ checked, value });
    const newArray = value.split(',');
    if (checked) {
      const oldItems = [];
      newArray.map((res) => oldItems.push(values.permissions.indexOf(res)));
      if (oldItems.length > -1) {
        oldItems.map((res) => values.permissions.splice(res, oldItems.length));
        newArray.map((res) => values.permissions.push(res));
      } else {
        newArray.map((res) => values.permissions.push(res));
      }
    } else {
      const itemsToRemove = [];
      newArray.map((res) => itemsToRemove.push(values.permissions.indexOf(res)));
      if (itemsToRemove.length > -1) {
        itemsToRemove.map((res) => values.permissions.splice(res, itemsToRemove.length));
      }
    }

    console.log(values);
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Role Name"
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <LabelStyle> Allow Permissions </LabelStyle>
              {permissionsList.map((permission, index) => (
                <Card sx={{ p: 3, margin: '1% ' }} key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={permission.operations.map((res) => res.value)}
                        onChange={(e) => handleParentPermissionCheck(e.target.checked, e.target.value, permission.id)}
                      />
                    }
                    label={permission.title}
                  />
                  {permission.operations.map((res, index) => (
                    <Grid item xs={12} key={index} sx={{ marginLeft: '1%' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={res.value}
                            checked={values.permissions.includes(res.value)}
                            onChange={(e) => handlePermissionCheck(e.target.checked, res.value)}
                          />
                        }
                        label={res.name}
                      />
                    </Grid>
                  ))}
                </Card>
              ))}
            </Grid>
            <Grid item xs={12}>
              <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={loading}>
                {!isEdit ? 'Create Role' : 'Save Changes'}
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Card>
  );
}
