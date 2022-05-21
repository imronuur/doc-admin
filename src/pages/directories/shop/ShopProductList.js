import PropTypes from 'prop-types';
// mater{ial
import { Grid } from '@mui/material';
import ShopProductCard from './ShopProductCard';
// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array.isRequired
  // isLoad: PropTypes.bool
};

export default function ProductList({ products, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {products &&
        products.map((product) => (
          <Grid key={product._id} item xs={12} sm={6} md={3}>
            <ShopProductCard product={product} />
          </Grid>
        ))}
    </Grid>
  );
}
