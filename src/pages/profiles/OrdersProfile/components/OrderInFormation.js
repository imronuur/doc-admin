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

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 70,
  height: 70,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm
}));
export default function OrderInFormation({ order }) {
  return (
    <CardStyle>
      <CardHeader title="Order Information" />
      <Grid container spacing={2} sx={{ p: 3 }}>
        <Stack sx={{ display: 'flex', flexDirection: 'row' }}>
          <ThumbImgStyle alt={order.name} src={order.images[0]} />

          <Stack>
            <Typography variant="body2">{order.name}</Typography>
            <Stack sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography component="span">{fCurrency(order.salePrice)}</Typography>
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Grid>
    </CardStyle>
  );
}
