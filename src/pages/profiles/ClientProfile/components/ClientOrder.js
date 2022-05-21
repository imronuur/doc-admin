import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import shopFilled from '@iconify/icons-ant-design/shop-filled';
import starFilled from '@iconify/icons-ant-design/star-filled';
import moneyCollectFilled from '@iconify/icons-ant-design/money-collect-filled';
import shoppingCartOulined from '@iconify/icons-ant-design/shopping-cart-outlined';
import userOutlined from '@iconify/icons-ant-design/user-outlined';
// material
import { styled, useTheme } from '@mui/material/styles';
import { Card, Typography, CardHeader, Stack } from '@mui/material';
import Label from '../../../../components/Label';
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

ClientOrder.propTypes = {
  order: PropTypes.object
};

export default function ClientOrder({ order }) {
  const theme = useTheme();

  return (
    <>
      {order ? (
        <CardStyle>
          <CardHeader title="Order Information" />

          <Stack spacing={2} sx={{ p: 3 }}>
            <Stack direction="row">
              <IconStyle icon={userOutlined} />
              <Stack direction="row" gap={3}>
                <Typography variant="body2">Order Id</Typography>
                <Typography variant="body2">{order?.orderTo}</Typography>
              </Stack>
            </Stack>

            <Stack direction="row">
              <IconStyle icon={starFilled} />
              <Stack direction="row" gap={4}>
                <Typography variant="body2">Order Status</Typography>
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={
                    (order.orderStatus === 'Cancelled' && 'error') ||
                    (order.orderStatus === 'Dispatched' && 'warning') ||
                    (order.orderStatus === 'Completed' && 'success') ||
                    (order.orderStatus === 'Not Processed' && 'default') ||
                    (order.orderStatus === 'processing' && 'primary') ||
                    (order.orderStatus === 'Cash On Delivery' && 'secondary')
                  }
                >
                  {order?.orderStatus}
                </Label>
              </Stack>
            </Stack>
            <Stack direction="row">
              <IconStyle icon={shopFilled} />
              <Stack direction="row" gap={4}>
                <Typography variant="body2">Order Amount</Typography>
                <Typography variant="body2">{fCurrency(order?.orderInfo?.amount)}</Typography>
              </Stack>
            </Stack>

            {order.products.length > 0 &&
              order.products.map((product) => (
                <>
                  <Stack direction="row">
                    <IconStyle icon={moneyCollectFilled} />
                    <Stack direction="row" gap={4}>
                      <Typography variant="body2">Product Size</Typography>
                      <Typography variant="body2">{product.size.toUpperCase()}</Typography>
                    </Stack>
                  </Stack>

                  <Stack direction="row">
                    <IconStyle icon={shoppingCartOulined} />
                    <Stack direction="row" gap={7}>
                      <Typography variant="body2">Order Qty</Typography>
                      <Typography variant="body2">{product.count}</Typography>
                    </Stack>
                  </Stack>
                </>
              ))}
          </Stack>
        </CardStyle>
      ) : (
        <CardStyle>
          <CardHeader title="Order Information" />
          <Stack direction="row">
            <Typography variant="body1" px={3} py={4}>
              No Client Order Found
            </Typography>
          </Stack>
        </CardStyle>
      )}
    </>
  );
}
