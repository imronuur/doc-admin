import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import closeFill from '@iconify/icons-eva/close-fill';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import { Form, FormikProvider, useFormik, FieldArray, getIn } from 'formik';
// material
import { Link as RouterLink } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';

import {
  Card,
  Grid,
  Stack,
  Select,
  InputAdornment,
  TextField,
  Typography,
  MenuItem,
  FormLabel,
  FormHelperText,
  CardHeader,
  Button,
  Box,
  Modal
} from '@mui/material';

import { fCurrency } from '../../../../utils/formatNumber';
import { Validations } from './Validations';
import { PATH_ADMIN } from '../../../../routes/paths';
// import { getTotals } from '../../../../redux/slices/invoiceSlice';
import { MIconButton } from '../../../../components/@material-extend';
// ----------------------------------------------------------------------
import InvoicePDF from '../invoice-to-pdf/InvoicePDF';

// ----------------------------------------------------------------------

ClientsForm.propTypes = {
  isEdit: PropTypes.bool,
  currentInvoice: PropTypes.object,
  handleCreate: PropTypes.func,
  loading: PropTypes.bool,
  clients: PropTypes.array,
  handleCreateInvoice: PropTypes.func
};

const statuses = [{ value: 'Paid' }, { value: 'Unpaid' }, { value: 'Overdue' }, { value: 'Draft' }];
const types = [{ value: 'Client' }, { value: 'User' }];

// modal style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '15px',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto'
};

const stackStyle = {
  marginBottom: 4,

  '&:hover': {
    backgroundColor: '#dcfce7',
    borderRadius: '5px'
  }
};

export default function ClientsForm({ isEdit, currentInvoice, handleCreateInvoice, loading, clients }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { user } = useSelector((state) => state.auth);
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [invoices, setInvoices] = useState([]);

  const formik = useFormik({
    // enableReinitialize: true,
    // eslint-disable-next-line no-unneeded-ternary
    initialValues: {
      refTo: currentInvoice?.refTo._id || '',
      invoiceNumber: '',
      dateCreated: currentInvoice?.dateCreated || '',
      type: currentInvoice?.type || '',
      status: currentInvoice?.status || '',
      dueDate: currentInvoice?.dueDate || '',
      total: total || '',
      items: currentInvoice?.items || [
        {
          unitPrice: '',
          quantity: '',
          itemName: '',
          discount: ''
        }
      ]
    },
    validationSchema: Validations,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      if (new Date(values.dueDate) >= new Date(values.dateCreated)) {
        try {
          const newValues = { ...values, total };
          handleCreateInvoice(newValues);

          setSubmitting(false);
        } catch (error) {
          setSubmitting(false);
          setErrors(error);
        }
      } else {
        enqueueSnackbar('Due Date Must be Greater Than Created Date', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
    }
  });

  const { errors, values, touched, handleSubmit, getFieldProps, setFieldValue } = formik;
  // const dispatch = useDispatch();

  // useEffect(() => {}, [values.items, dispatch]);
  // const totalInvoice = () => {
  // };

  // const total = values.items.map((item) => {
  //   const { quantity, unitPrice, discount } = item;
  //   const totalPrice = Number(quantity) * Number(unitPrice);
  //   const price = totalPrice - totalPrice * (discount / 100);
  //   return price;
  // });

  // useEffect(() => {
  //   // setFieldValue('total', Number(total));
  //   dispatch(getTotals());
  // }, [values.items]);
  // // console.log(totalInvoice);
  // console.log(values);
  // useEffect(() => {
  //   let subTotal = 0;

  //   values.items.forEach((item) => {
  //     const quantityNumber = parseFloat(item.quantity);
  //     const unitPrice = parseFloat(item.unitPrice);
  //     const discount = parseFloat(item.discount);
  //     const amount = unitPrice && quantityNumber ? quantityNumber * unitPrice : 0;
  //     const totalPrice = amount - amount * (discount / 100);

  //     subTotal += amount;
  //     subTotal = totalPrice;
  //   });

  //   setTotal(subTotal);
  //   setFieldValue('total', total);
  // }, [values.items]);

  const handleChange = (index, e) => {
    console.log(e.target.value);
    const values = [...values.items];
    values[index][e.target.name] = e.target.value;
    setInvoices({ ...values, items: values });
  };

  // useEffect(() => {
  //   // Get the subtotal
  //   const subTotal = () => {
  //     const arr = document.getElementsByName('amount');

  //     let subtotal = 0;
  //     for (let i = 0; i < arr.length; i += 1) {
  //       if (arr[i].value) {
  //         subtotal += +arr[i].value;
  //       }
  //       setSubTotal(subtotal);
  //     }
  //   };

  //   subTotal();
  // }, [invoices]);

  // useEffect(() => {
  //   const total = () => {
  //     const overallSum = subTotal;

  //     setTotal(overallSum);
  //   };
  //   total();
  // }, [invoices, subTotal]);
  const sumValues = () => {
    values.items.map((item) => {
      const { quantity, unitPrice, discount } = item;
      const totalPrice = Number(quantity) * Number(unitPrice);
      const price = totalPrice - totalPrice * (discount / 100);
      return price;
    });
  };
  console.log(sumValues());
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Card>
          <Grid container sx={{ p: 4 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ color: 'text.disabled', mb: 2 }}>
                From:
              </Typography>
              <Typography fontWeight="600">{user.name}</Typography>
              <Typography variant="p">
                {user.email} <br /> Role: {user.role}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ mb: 3, color: 'text.disabled' }}>
                Select A Reference Client
              </Typography>
              <Select fullWidth {...getFieldProps('refTo')}>
                {clients &&
                  clients.map((client) => (
                    <MenuItem key={client._id} value={client._id}>
                      {client.name}
                    </MenuItem>
                  ))}
              </Select>
              <FormHelperText error sx={{ m: '1%' }}>
                {touched.refTo && errors.refTo}
              </FormHelperText>

              {/* <Typography variant="h5" sx={{ color: 'text.disabled', mb: 2 }}>
                To:
              </Typography>

              <Typography fontWeight="600">{toClient?.name}</Typography>
              <Typography variant="p">
                {toClient?.email} <br /> {toClient?.phone}
              </Typography> */}
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Stack sx={{ display: 'flex', flexDirection: 'row' }} gap={3}>
                  <Grid item xs={12}>
                    <FormLabel>Invoice Number</FormLabel>
                    <TextField fullWidth value="INV-789" disabled />
                  </Grid>
                  <Grid item xs={12}>
                    <FormLabel>Status</FormLabel>
                    <Select fullWidth {...getFieldProps('status')} error={Boolean(touched.status && errors.status)}>
                      {statuses.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText error sx={{ m: '1%' }}>
                      {touched.status && errors.status}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <FormLabel>Select Type</FormLabel>
                    <Select fullWidth {...getFieldProps('type')} error={Boolean(touched.type && errors.type)}>
                      {types.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText error sx={{ m: '1%' }}>
                      {touched.type && errors.type}
                    </FormHelperText>
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
                    <FormHelperText error sx={{ m: '1%' }}>
                      {new Date(values.dateCreated) >= new Date(values.deuDate) &&
                        'Date Create must be less than Date Due'}
                    </FormHelperText>
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
                                      <Grid item xs={2}>
                                        <TextField
                                          onChange={(e) => handleChange(index, e)}
                                          value={sumValues}
                                          fullWidth
                                          label="Total"
                                          name="amount"
                                          InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>
                                          }}
                                        />

                                        {/* <Typography
                                          disabled
                                          name="total"
                                          sx={{
                                            border: 1,
                                            padding: 2,
                                            borderRadius: 1,
                                            borderColor: '#f1f1f1',
                                            color: 'text.disabled'
                                          }}
                                        > */}
                                        {/* {fCurrency(total)} */}
                                        {/* </Typography> */}
                                      </Grid>
                                    </Stack>
                                  </Stack>

                                  <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                      variant="outlined"
                                      disabled={arrayHelpers.form.values.items.length === 1}
                                      color="error"
                                      onClick={() => arrayHelpers.remove(index)}
                                      sx={{ mt: 1, ml: 1 }}
                                    >
                                      Remove
                                    </Button>
                                  </Grid>
                                </>
                              ))}
                              <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} mt={2} my={2} sx={{ display: 'flex', justifyContent: 'flex-end' }} gap={3}>
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
