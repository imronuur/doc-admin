import PropTypes from 'prop-types';
// import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
// import twitterFill from '@iconify/icons-eva/twitter-fill';
// import linkedinFill from '@iconify/icons-eva/linkedin-fill';
// import facebookFill from '@iconify/icons-eva/facebook-fill';
// import instagramFilled from '@iconify/icons-ant-design/instagram-filled';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Box, Link, Stack, Rating, Divider, TextField, Typography } from '@mui/material';

// redux
// routes
// utils
import { fShortenNumber, fCurrency } from '../../../../../utils/formatNumber';
//
import Label from '../../../../../components/Label';

// ----------------------------------------------------------------------

// const SOCIALS = [
//   {
//     name: 'Facebook',
//     icon: <Icon icon={facebookFill} width={20} height={20} color="#1877F2" />
//   },
//   {
//     name: 'Instagram',
//     icon: <Icon icon={instagramFilled} width={20} height={20} color="#D7336D" />
//   },
//   {
//     name: 'Linkedin',
//     icon: <Icon icon={linkedinFill} width={20} height={20} color="#006097" />
//   },
//   {
//     name: 'Twitter',
//     icon: <Icon icon={twitterFill} width={20} height={20} color="#1C9CEA" />
//   }
// ];

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8)
  }
}));

// ----------------------------------------------------------------------

ProductDetailsSumary.propTypes = {
  currentProduct: PropTypes.object
};

export default function ProductDetailsSumary({ currentProduct }) {
  const theme = useTheme();
  const { name, regularPrice, description, salePrice, review, available, size } = currentProduct;

  return (
    <RootStyle>
      <Label
        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
        color={(available <= 0 && 'error') || (available <= 10 && 'warning') || 'success'}
      >
        {(available >= 10 && sentenceCase('In Stock')) ||
          (available <= 10 && sentenceCase('Low In Stock')) ||
          (available <= 0 && sentenceCase('Out of Stock')) ||
          ''}
      </Label>
      <Typography variant="h5" paragraph>
        {name}
      </Typography>
      <Stack spacing={0.5} direction="row" alignItems="center" sx={{ mb: 2 }}>
        {review &&
          review.map((r, i) => (
            <>
              <Rating value={r.rating} precision={0.1} readOnly />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                ({fShortenNumber(r.rating)}
                reviews)
              </Typography>
            </>
          ))}
      </Stack>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 4.5 }}>
        <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
          Regular Price
        </Typography>
        <Typography variant="h4" sx={{ mb: 3 }}>
          <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
            {regularPrice && fCurrency(regularPrice)}
          </Box>
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
          Sale Price
        </Typography>
        <Typography variant="h4" sx={{ mb: 3 }}>
          <Box component="span">&nbsp;{fCurrency(salePrice)}</Box>
        </Typography>
      </Stack>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <Stack spacing={3} sx={{ my: 3 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Size
          </Typography>
          <TextField
            select
            size="small"
            SelectProps={{ native: true }}
            FormHelperTextProps={{
              sx: {
                textAlign: 'right',
                margin: 0,
                mt: 1
              }
            }}
            helperText={
              <Link href="#" underline="always" color="text.primary">
                Size Chart
              </Link>
            }
          >
            {size.map((size) => (
              <option key={size} value={size.sizeNo}>
                {size.sizeNo}
              </option>
            ))}
          </TextField>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Quantity
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            {available}
          </Typography>
        </Stack>
        <Stack justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ mt: 2.5 }}>
            Product Description :-
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ borderStyle: 'dashed' }} />
    </RootStyle>
  );
}
