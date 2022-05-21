import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import userOutlined from '@iconify/icons-ant-design/user-outlined';

// material
import { styled } from '@mui/material/styles';
import { Card, Typography, CardHeader, Stack } from '@mui/material';
import { fCurrency } from '../../../../utils/formatNumber';

// styles
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

ClientInvoice.propTypes = {
  invoice: PropTypes.object
};

export default function ClientInvoice({ invoice }) {
  return (
    <CardStyle>
      <CardHeader title="Invoice Information" />
      {invoice.items.map((item) => (
        <Stack spacing={2} sx={{ p: 3 }} key={item}>
          <Stack direction="row">
            <IconStyle icon={userOutlined} />
            <Typography variant="body2">
              Item Name :-
              <span style={{ paddingLeft: 10, fontWeight: 800 }}>{item.itemName}</span>
            </Typography>
          </Stack>
          <Stack direction="row">
            <IconStyle icon={userOutlined} />
            <Typography variant="body2">
              Quantity :-
              <span style={{ paddingLeft: 10, fontWeight: 800 }}>{item.quantity}</span>
            </Typography>
          </Stack>
          <Stack direction="row">
            <IconStyle icon={userOutlined} />
            <Typography variant="body2">
              Unit Price :-
              <span style={{ paddingLeft: 10, fontWeight: 800 }}>{fCurrency(item.unitPrice)}</span>
            </Typography>
          </Stack>
          <Stack direction="row">
            <IconStyle icon={userOutlined} />
            <Typography variant="body2">
              Discount :-
              <span style={{ paddingLeft: 10, fontWeight: 800 }}>{fCurrency(item.discount)}</span>
            </Typography>
          </Stack>
          <Stack direction="row">
            <IconStyle icon={userOutlined} />
            <Typography variant="body2">
              Total Items :-
              <span style={{ paddingLeft: 10, fontWeight: 800 }}>{fCurrency(invoice.total)}</span>
            </Typography>
          </Stack>
        </Stack>
      ))}
    </CardStyle>
  );
}
