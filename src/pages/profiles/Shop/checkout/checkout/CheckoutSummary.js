import PropTypes from 'prop-types';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
// material
import {
  Box,
  Card,
  Stack,
  Button,
  Divider,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  InputAdornment
} from '@mui/material';
import { useSelector } from '../../../../../redux/store';
// utils
import { fCurrency } from '../../../../../utils/formatNumber';

// ----------------------------------------------------------------------

CheckoutSummary.propTypes = {
  total: PropTypes.number,
  discount: PropTypes.number,
  subtotal: PropTypes.number,
  shipping: PropTypes.number,
  onEdit: PropTypes.func,
  enableEdit: PropTypes.bool,
  onApplyDiscount: PropTypes.func
};

export default function CheckoutSummary({
  total,
  onEdit,
  codes,
  subtotal,
  shipping = null,
  onApplyDiscount,
  enableEdit = false
}) {
  const displayShipping = shipping !== null ? 'Free' : '-';
  const [discountValue, setDiscountValue] = useState('');
  const [calculateDiscount, setCalculateDiscount] = useState(false);
  const coupouns = codes.data.find((c) => c);

  const ApplyDiscount = () => {
    if (discountValue === coupouns.name) {
      onApplyDiscount(coupouns.discount);
      setCalculateDiscount(true);
    } else {
      alert('Invalid Coupon');
      setCalculateDiscount(false);
    }
  };
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Order Summary"
        action={
          enableEdit && (
            <Button size="small" type="button" onClick={onEdit} startIcon={<Icon icon={editFill} />}>
              Edit
            </Button>
          )
        }
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sub Total
            </Typography>
            <Typography variant="subtitle2">{fCurrency(subtotal)}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Discount
            </Typography>
            <Typography variant="subtitle2">{calculateDiscount ? fCurrency(-coupouns.discount) : '-'}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Shipping
            </Typography>
            <Typography variant="subtitle2">{shipping ? fCurrency(shipping) : displayShipping}</Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Total</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                {fCurrency(total)}
              </Typography>
              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                (VAT included if applicable)
              </Typography>
            </Box>
          </Stack>

          {
            <TextField
              fullWidth
              placeholder="Discount codes / Gifts"
              // value={`DISCOUNT CODE: $${coupouns}`}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button type="button" onClick={ApplyDiscount} sx={{ mr: -0.5 }}>
                      Apply
                    </Button>
                  </InputAdornment>
                )
              }}
            />
          }
        </Stack>
      </CardContent>
    </Card>
  );
}
