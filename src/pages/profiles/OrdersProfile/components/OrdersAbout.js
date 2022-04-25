import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Icon } from '@iconify/react';
// material
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack, Grid, TextField, Button } from '@mui/material';
import { FormikProvider, Form, useFormik } from 'formik';
import { fCurrency } from '../../../../utils/formatNumber';
import OrderInFormation from './OrderInFormation';
import OrderTotalSummary from './OrderTotalSummary';
import OrderShippingAddress from './OrderShippingAddress';
import UpdateStatusModal from './UpdateStatusModal';
// ----------------------------------------------------------------------

const IconStyle = styled(Icon)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2)
}));

const CardStyle = styled(Card)(({ theme }) => ({
  paddingBottom: theme.spacing(0)
}));

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 70,
  height: 70,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm
}));

// ----------------------------------------------------------------------

RouteAbout.propTypes = {
  order: PropTypes.object
};

export default function RouteAbout({ order }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Stack spacing={3}>
          <OrderInFormation order={order} />
          <OrderShippingAddress order={order} />
          <UpdateStatusModal />
        </Stack>
      </Grid>

      <Grid item xs={12} md={6}>
        <OrderTotalSummary order={order} />
      </Grid>
    </Grid>
  );
}
