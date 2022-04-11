import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Chip,
  Grid,
  Stack,
  Switch,
  Select,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  Autocomplete,
  InputAdornment,
  FormHelperText,
  FormControlLabel,
  MenuItem,
  FormLabel
} from '@mui/material';

import { useSelector } from '../../../../redux/store';
import { Validations } from './Validations';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ClientsForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
  handleCreate: PropTypes.func,
  loading: PropTypes.bool
};

const statuses = [{ value: 'All' }, { value: 'Paid' }, { value: 'Unpaid' }, { value: 'Overdue' }, { value: 'Draft' }];
export default function ClientsForm({ isEdit, currentClient, handleCreate, loading }) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentClient?.name || '',
      state: currentClient?.state || '',
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

  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Card>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Stack sx={{ display: 'flex', flexDirection: 'row' }} gap={3}>
                  <Grid item xs={12}>
                    <FormLabel>Invoice Number</FormLabel>

                    <TextField fullWidth label="INV-7891" disabled />
                  </Grid>
                  <Grid item xs={12}>
                    <FormLabel>Status</FormLabel>
                    <Select fullWidth {...getFieldProps('status')}>
                      {statuses.map((option, index) => (
                        <MenuItem key={index} value={index}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>

                  <Grid item xs={12}>
                    <FormLabel>Date Create</FormLabel>
                    <TextField
                      fullWidth
                      {...getFieldProps('createDate')}
                      error={Boolean(touched.createDate && errors.createDate)}
                      helperText={touched.createDate && errors.createDate}
                      type="date"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormLabel>Due Date</FormLabel>

                    <TextField
                      fullWidth
                      {...getFieldProps('dueDate')}
                      error={Boolean(touched.dueDate && errors.dueDate)}
                      helperText={touched.dueDate && errors.dueDate}
                      type="date"
                    />
                  </Grid>
                </Stack>
                <Grid item xs={12} mt={2} my={2}>
                  <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={loading}>
                    {!isEdit ? 'Create Invoice' : 'Save Changes'}
                  </LoadingButton>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Card>
      </Form>
    </FormikProvider>
  );
}
