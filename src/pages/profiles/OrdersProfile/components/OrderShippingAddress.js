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
export default function OrderShippingAddress({ order }) {
  return (
    <CardStyle>
      <CardHeader title="Shipping Address" />
      <Grid spacing={2} sx={{ p: 3 }}>
        <Stack>
          <TextField size="large" type="text" fullWidth multiline rows={3} maxRows={4} />
        </Stack>
      </Grid>
    </CardStyle>
  );
}
