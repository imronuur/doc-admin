import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik, FieldArray, getIn } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Grid,
  Stack,
  Select,
  TextField,
  Typography,
  MenuItem,
  FormLabel,
  CardHeader,
  Button
} from '@mui/material';

import { Validations } from './Validations';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ClientsForm.propTypes = {
  isEdit: PropTypes.bool,
  currentInvoice: PropTypes.object,
  handleCreate: PropTypes.func,
  loading: PropTypes.bool
};

const statuses = [{ value: 'All' }, { value: 'Paid' }, { value: 'Unpaid' }, { value: 'Overdue' }, { value: 'Draft' }];
const types = [{ value: 'Client' }, { value: 'User' }];
export default function ClientsForm({ isEdit, currentInvoice, handleCreateInvoice, loading }) {
  const formik = useFormik({
    enableReinitialize: true,
    // eslint-disable-next-line no-unneeded-ternary
    initialValues: currentInvoice
      ? currentInvoice
      : {
          items: [
            {
              itemName: '',
              unitPrice: '',
              quantity: '',
              discount: ''
            }
          ]
        },
    validationSchema: Validations,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        handleCreateInvoice(values);
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
                        <MenuItem key={index} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={12}>
                    <FormLabel>Select Type</FormLabel>

                    <Select fullWidth {...getFieldProps('type')}>
                      {types.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={12}>
                    <FormLabel>Date Create</FormLabel>
                    <TextField
                      fullWidth
                      {...getFieldProps('dateCreated')}
                      error={Boolean(touched.dateCreated && errors.dateCreated)}
                      helperText={touched.dateCreated && errors.dateCreated}
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
                <Stack sx={{ display: 'flex', flexDirection: 'row' }} gap={3} mt={3}>
                  <Grid item xs={12}>
                    <FieldArray
                      name="items"
                      render={(arrayHelpers) => (
                        <>
                          {arrayHelpers.form.values.items && arrayHelpers.form.values.items.length >= 0 ? (
                            <>
                              {arrayHelpers.form.values.items.map((res, index) => (
                                <>
                                  <CardHeader title="Details" sx={{ p: 1, color: 'text.disabled' }} />
                                  <Stack spacing={3} key={index}>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                                      <Grid item xs={6}>
                                        <TextField
                                          fullWidth
                                          label="Item name"
                                          {...getFieldProps(`items.${index}.itemName`)}
                                          error={Boolean(getIn(errors, `items.${index}.itemName`))}
                                          helperText={getIn(errors, `items.${index}.itemName`)}
                                        />
                                      </Grid>
                                      <Grid item xs={2}>
                                        <TextField
                                          fullWidth
                                          label="Unit Price"
                                          {...getFieldProps(`items.${index}.unitPrice`)}
                                          error={Boolean(getIn(errors, `items.${index}.unitPrice`))}
                                          helperText={getIn(errors, `items.${index}.unitPrice`)}
                                        />
                                      </Grid>
                                      <Grid item xs={2}>
                                        <TextField
                                          fullWidth
                                          label="Quantity"
                                          {...getFieldProps(`items.${index}.quantity`)}
                                          error={Boolean(getIn(errors, `items.${index}.quantity`))}
                                          helperText={getIn(errors, `items.${index}.quantity`)}
                                        />
                                      </Grid>
                                      <Grid item xs={2}>
                                        <TextField
                                          fullWidth
                                          label="Discount"
                                          {...getFieldProps(`items.${index}.discount`)}
                                          error={Boolean(getIn(errors, `items.${index}.discount`))}
                                          helperText={getIn(errors, `items.${index}.discount`)}
                                        />
                                      </Grid>
                                    </Stack>
                                  </Stack>

                                  <Grid item xs={12} sm={6}>
                                    <Grid item xs={2}>
                                      <Button
                                        variant="contained"
                                        disabled={arrayHelpers.form.values.items.length === 1}
                                        color="error"
                                        onClick={() => arrayHelpers.remove(index)}
                                        sx={{ mt: 3, ml: 1 }}
                                      >
                                        Remove
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </>
                              ))}
                              <Grid item xs={12}>
                                <Button
                                  type="button"
                                  variant="text"
                                  onClick={() =>
                                    arrayHelpers.push({
                                      itemName: '',
                                      unitPrice: '',
                                      quantity: '',
                                      discount: ''
                                    })
                                  }
                                  sx={{ mt: 3, ml: 1 }}
                                >
                                  + Add Item
                                </Button>
                              </Grid>
                            </>
                          ) : (
                            <Typography> Nothing</Typography>
                          )}
                        </>
                      )}
                    />
                  </Grid>
                </Stack>
                <Grid item xs={6} mt={2} my={2} sx={{ display: 'flex', justifyContent: 'flex-end' }} gap={3}>
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
