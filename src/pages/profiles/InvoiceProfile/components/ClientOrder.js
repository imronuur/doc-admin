import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import calendarFilled from '@iconify/icons-ant-design/calendar-filled';
import shopFilled from '@iconify/icons-ant-design/shop-filled';
import fileDoneOutlined from '@iconify/icons-ant-design/file-done-outlined';
import userOutlined from '@iconify/icons-ant-design/user-outlined';

// material
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack } from '@mui/material';
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

export default function ClientOrder({ order }) {
  return (
    <>
      {order ? (
        <CardStyle>
          <CardHeader title="Order Information" />

          <Stack spacing={2} sx={{ p: 3 }}>
            <Stack direction="row">
              <IconStyle icon={calendarFilled} />
              <Typography variant="body2">{order?.orderTo}</Typography>
            </Stack>

            <Stack direction="row">
              <IconStyle icon={calendarFilled} />
              <Typography variant="body2">{order?.orderStatus}</Typography>
            </Stack>
            <Stack direction="row">
              <IconStyle icon={calendarFilled} />
              <Typography variant="body2">{fCurrency(order?.orderInfo?.amount)}</Typography>
            </Stack>
            {order.products.length > 0 &&
              order.products.map((product) => (
                <>
                  <Stack direction="row">
                    <IconStyle icon={fileDoneOutlined} />
                    <Typography variant="subtitle2" color="text.primary">
                      {product.size.toUpperCase()}
                    </Typography>
                  </Stack>
                  <Stack direction="row">
                    <IconStyle icon={shopFilled} />
                    <Typography variant="body2">{product.count}</Typography>
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
