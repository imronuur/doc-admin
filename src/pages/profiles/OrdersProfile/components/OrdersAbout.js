import PropTypes from 'prop-types';
import { useState } from 'react';
import { Icon } from '@iconify/react';
// material
import { styled } from '@mui/material/styles';
import { Card, Typography, Stack, Grid, TextField, Select, MenuItem, Divider } from '@mui/material';
import { FormikProvider, Form, useFormik } from 'formik';
import closeFill from '@iconify/icons-eva/close-fill';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../../../../redux/thunk/orderThunk';
import { PATH_ADMIN } from '../../../../routes/paths';
import { MIconButton } from '../../../../components/@material-extend';
import { fCurrency } from '../../../../utils/formatNumber';
import Label from '../../../../components/Label';

// ----------------------------------------------------------------------

// const IconStyle = styled(Icon)(({ theme }) => ({
//   width: 20,
//   height: 20,
//   marginTop: 1,
//   flexShrink: 0,
//   marginRight: theme.spacing(2)
// }));

const CardStyle = styled(Card)(({ theme }) => ({
  paddingBottom: theme.spacing(0)
}));

// const ThumbImgStyle = styled('img')(({ theme }) => ({
//   width: 70,
//   height: 70,
//   objectFit: 'cover',
//   margin: theme.spacing(0, 2),
//   borderRadius: theme.shape.borderRadiusSm
// }));

const statuses = ['Not Processed', 'Cash On Delivery', 'processing', 'Dispatched', 'Cancelled', 'Completed'];
// ----------------------------------------------------------------------

RouteAbout.propTypes = {
  currentOrder: PropTypes.object,
  accessToken: PropTypes.string.isRequired
};

export default function RouteAbout({ currentOrder, accessToken }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const handleUpdateOrder = async (status) => {
    setLoading(true);
    const reqObject = {
      status,
      accessToken
    };
    const reduxRes = await dispatch(updateOrderStatus(reqObject));
    if (reduxRes.type === 'update-order-status/update/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'update-order-status/update/fulfilled') {
      enqueueSnackbar(`Order Status Updated!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    }
    navigate(`${PATH_ADMIN.directories.orders}`);
  };

  const formik = useFormik({
    initialValues: {
      _id: currentOrder?._id,
      product: currentOrder?.products,
      orderBy: currentOrder.orderBy,
      orderTo: currentOrder.orderTo,
      orderInfo: currentOrder.orderInfo,
      orderStatus: currentOrder?.orderStatus
      // amount: order?.orderInfo.amount
      // shippingFee: order?.orderInfo.shippingFee,
      // shippingAddress: order?.orderInfo.shippingAddress,
      // discount: order?.orderInfo.discount
    },
    onSubmit: (values, { setSubmitting, setErrors }) => {
      try {
        const status = {
          orderId: values._id,
          orderStatus: values.orderStatus
        };
        handleUpdateOrder(status);
        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <CardStyle sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Order Information
            </Typography>
            <Stack spacing={2}>
              {' '}
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography>Order Amount</Typography>
                <Typography variant="">{fCurrency(currentOrder?.orderInfo.total)}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography>Order Status</Typography>
                <Label>{currentOrder?.orderStatus}</Label>
              </Stack>
            </Stack>

            <Divider sx={{ m: 2 }} />
            <Stack spacing={1}>
              <Typography>Select Status To Change</Typography>
              <Select fullWidth {...getFieldProps('orderStatus')}>
                {statuses.map((status, index) => (
                  <MenuItem key={index} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
              <Typography>Total</Typography>
              <TextField variant="outlined" size="large" type="number" disabled {...getFieldProps('orderInfo.total')} />
              <Grid>
                <Typography>Shipping Address</Typography>
                <Stack>
                  <TextField size="large" type="text" fullWidth multiline rows={3} maxRows={4} />
                </Stack>
              </Grid>
              <Grid>
                {' '}
                <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={loading}>
                  Save Changes
                </LoadingButton>
              </Grid>
            </Stack>
          </Stack>
        </CardStyle>
      </Form>
    </FormikProvider>
  );
}
