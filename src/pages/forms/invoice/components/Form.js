import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import closeFill from '@iconify/icons-eva/close-fill';
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
  TextField,
  Typography,
  MenuItem,
  FormLabel,
  CardHeader,
  Button,
  Box,
  Modal,
  FormHelperText
} from '@mui/material';
import { useSnackbar } from 'notistack';

import { MIconButton } from '../../../../components/@material-extend';
import { fCurrency } from '../../../../utils/formatNumber';
import { Validations } from './Validations';
import { PATH_DASHBOARD, PATH_ADMIN } from '../../../../routes/paths';
import { getInvoiceTotal } from '../../../../redux/slices/invoiceSlice';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ClientsForm.propTypes = {
  isEdit: PropTypes.bool,
  currentInvoice: PropTypes.object,
  handleCreate: PropTypes.func,
  loading: PropTypes.bool,
  clients: PropTypes.array
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

  const formik = useFormik({
    enableReinitialize: true,
    // eslint-disable-next-line no-unneeded-ternary
    initialValues: currentInvoice
      ? currentInvoice
      : {
          refTo: {},
          invoiceNumber: '',
          dateCreated: '',
          dueDate: '',
          total: 0,
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
      if (new Date(values.dueDate) >= new Date(values.dateCreated)) {
        try {
          handleCreateInvoice(values);
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
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [toClient, setToClient] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const getClient = (client) => {
    setToClient(client);
    setFieldValue('refTo', client);

    handleClose();
  };

  useEffect(() => {
    dispatch(getInvoiceTotal());
  }, [values.items, dispatch]);

  // const total = values.items.map((item) => {
  //   const { quantity, unitPrice, discount } = item;
  //   const totalPrice = Number(quantity) * Number(unitPrice);
  //   const price = totalPrice - totalPrice * (discount / 100);
  //   return price;
  // });

  // useEffect(() => {
  //   setFieldValue('total', Number(total));
  // }, [values.items]);

  console.log(values);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Card>
          <Grid item sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', p: 3 }}>
            <Stack>
              <Typography variant="h5" sx={{ color: 'text.disabled', mb: 2 }}>
                From:
              </Typography>
              <Typography fontWeight="600">{user.name}</Typography>
              <Typography variant="p">
                {user.email} <br /> Role: {user.role}
              </Typography>
            </Stack>
            <Grid>
              <Typography variant="h5" sx={{ color: 'text.disabled', mb: 2 }}>
                To:
              </Typography>
              {toClient && (
                <>
                  <Typography fontWeight="600">{toClient.name}</Typography>
                  <Typography variant="p">
                    {toClient.email} <br /> {toClient.phone}
                  </Typography>
                </>
              )}

              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Stack
                    sx={{
                      display: 'flex',
                      flexDirection: 'row'
                    }}
                    gap={3}
                    mb={3}
                  >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                      Select Client
                    </Typography>
                    <Button variant="outlined" component={RouterLink} to={PATH_ADMIN.forms.newClients}>
                      + Add New
                    </Button>
                  </Stack>
                  {clients.length > 0
                    ? clients.map((client) => (
                        <Stack sx={stackStyle} id="modal-modal-description" onClick={() => getClient(client)}>
                          <Typography sx={{ cursor: 'pointer', paddingLeft: '4px' }}>{client.name}</Typography>
                          <Typography color="primary" sx={{ cursor: 'pointer', paddingLeft: '4px' }}>
                            {client.email}
                          </Typography>
                          <Typography sx={{ cursor: 'pointer', paddingLeft: '4px' }}>{client.phone}</Typography>
                        </Stack>
                      ))
                    : 'No Clients Found'}
                </Box>
              </Modal>
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Button onClick={handleOpen}>+ Add to</Button>
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
                    <Select
                      fullWidth
                      {...getFieldProps('type')}
                      error={Boolean(touched.type && errors.type)}
                      helperText={touched.type && errors.type}
                    >
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
                                      <Grid item xs={2}>
                                        {/* <TextField
                                          fullWidth
                                          disabled
                                          label="Total"
                                          defaultValue={total}
                                          {...getFieldProps(`items.${index}.total`)}
                                          error={Boolean(getIn(errors, `items.${index}.total`))}
                                          helperText={getIn(errors, `items.${index}.total`)}
                                        /> */}
                                        <Typography
                                          disabled
                                          sx={{
                                            border: 1,
                                            padding: 2,
                                            borderRadius: 1,
                                            borderColor: '#f1f1f1',
                                            color: 'text.disabled'
                                          }}
                                        >
                                          {fCurrency(Number(values.total))}
                                        </Typography>
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
