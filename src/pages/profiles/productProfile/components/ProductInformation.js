import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import carFilled from '@iconify/icons-ant-design/car-filled';
import calendarFilled from '@iconify/icons-ant-design/calendar-filled';
import shopFilled from '@iconify/icons-ant-design/shop-filled';
import fileDoneOutlined from '@iconify/icons-ant-design/file-done-outlined';
import userOutlined from '@iconify/icons-ant-design/user-outlined';
// material
import { styled, useTheme } from '@mui/material/styles';

import { Link, Card, Typography, CardHeader, Stack, Grid } from '@mui/material';
import Label from '../../../../components/Label';
import { fCurrency } from '../../../../utils/formatNumber';

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
  width: 150,
  height: 90,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm
}));

export default function ProductInformation({ product }) {
  const theme = useTheme();

  return (
    <CardStyle>
      <CardHeader title="Product Information" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row">
          <ThumbImgStyle src={product.images[0]} />
          <ThumbImgStyle src={product.images[1]} />
        </Stack>
        <Stack direction="row">
          <IconStyle icon={userOutlined} />
          <Typography variant="body2">{product.name}</Typography>
        </Stack>

        <Grid container>
          <Grid item xs={12} md={6}>
            <Stack direction="row">
              <IconStyle icon={calendarFilled} />
              <Typography variant="body2">
                Quantity :-
                <span style={{ paddingLeft: 10, fontWeight: 800 }}>{product.quantity}</span>
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row">
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={(product.quantity <= 0 && 'error') || (product.quantity <= 10 && 'warning') || 'success'}
              >
                {(product.quantity >= 10 && sentenceCase('In Stock')) ||
                  (product.quantity <= 10 && sentenceCase('Low In Stock')) ||
                  (product.quantity < 0 && sentenceCase('Out of Stock')) ||
                  ''}
              </Label>
            </Stack>
          </Grid>
        </Grid>
        <Stack direction="row">
          <IconStyle icon={calendarFilled} />
          <Typography variant="body2">
            Sale Price :-
            <span style={{ paddingLeft: 10, fontWeight: 800 }}>{fCurrency(product.salePrice)}</span>
          </Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={fileDoneOutlined} />
          <Typography variant="subtitle2" color="text.primary">
            Solded :-
            <span style={{ paddingLeft: 10, fontWeight: 800 }}>{product.sold}</span>
          </Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={shopFilled} />
          <Typography variant="body2">
            Category :-
            <span style={{ paddingLeft: 10, fontWeight: 800 }}>{product.category?.name}</span>
          </Typography>
        </Stack>
      </Stack>
    </CardStyle>
  );
}
