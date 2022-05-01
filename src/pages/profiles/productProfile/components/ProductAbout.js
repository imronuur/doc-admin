import PropTypes from 'prop-types';

import { Grid, Stack, Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import ProductInformation from './ProductInformation';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

RouteAbout.propTypes = {
  product: PropTypes.object
};

export default function RouteAbout({ product }) {
  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        <Stack spacing={3}>
          <ProductInformation product={product} />
        </Stack>
      </Grid>
      {/* <Grid item xs={12} md={6}>
        <Stack sx={{ pl: 3 }}>
          <CardStyle>
            <Stack spacing={2}></Stack>
          </CardStyle>
        </Stack>
      </Grid> */}
    </Grid>
  );
}
