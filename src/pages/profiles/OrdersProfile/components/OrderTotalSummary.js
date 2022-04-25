import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
// material
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack, Grid, TextField, Button } from '@mui/material';
import { FormikProvider, Form, useFormik } from 'formik';
import { fCurrency } from '../../../../utils/formatNumber';

const CardStyle = styled(Card)(({ theme }) => ({
  paddingBottom: theme.spacing(0)
}));

export default function OrderTotalSummary({ order }) {
  const handleCreate = (values) => {
    console.log(values);
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      total: '',
      shippingFee: '',
      discount: ''
    },

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
  const total = (discount, shipping, totalPrice) => totalPrice * shipping - discount;
  // useEffect(() => {
  // setFieldValue('total', total);
  // }, [values]);
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <CardStyle sx={{ mt: 2 }}>
          <CardHeader title="Total Summary" />
          <Grid spacing={2} sx={{ p: 3 }}>
            <Stack sx={{ display: 'flex', flexDirection: 'row' }}>
              <Stack>
                <Typography variant="body1">
                  Subtotal : <span style={{ paddingLeft: 60 }}>{fCurrency(order.salePrice)}</span>
                </Typography>
                <Stack sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="span">Shipping Fee : $</Typography>

                    <TextField
                      sx={{ pl: 0.5 }}
                      style={{ width: 90 }}
                      variant="outlined"
                      size="small"
                      type="number"
                      {...getFieldProps('shippingFee')}
                      defaultValue={order.quantity}
                    />
                  </Typography>
                </Stack>
                <Stack sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="span">Discount Fee : -$</Typography>

                    <TextField
                      sx={{ pl: 0.5 }}
                      style={{ width: 90 }}
                      variant="outlined"
                      size="small"
                      type="number"
                      {...getFieldProps('discount')}
                      defaultValue={order.quantity}
                    />
                  </Typography>
                </Stack>
                <Stack sx={{ mt: 2 }}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    Total:{' '}
                    <span style={{ paddingLeft: 90 }}>
                      {fCurrency(total(values.discount, values.quantity, order.salePrice))}
                    </span>
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        </CardStyle>
        <Button sx={{ mt: 2 }} type="submit" fullWidth variant="contained" size="large">
          Save Changes
        </Button>
      </Form>
    </FormikProvider>
  );
}
