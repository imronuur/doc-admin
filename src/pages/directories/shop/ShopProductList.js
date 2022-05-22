import PropTypes from 'prop-types';
// mater{ial
import { Skeleton, Grid } from '@mui/material';
import ShopProductCard from './ShopProductCard';

// ----------------------------------------------------------------------

const SkeletonLoad = (
  <>
    {[...Array(12)].map((_, index) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '115%', borderRadius: 2 }} />
      </Grid>
    ))}
  </>
);

ProductList.propTypes = {
  products: PropTypes.array.isRequired
  // isLoad: PropTypes.bool
};

export default function ProductList({ products, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {products?.data?.map((product) => (
        <Grid key={product._id} item xs={12} sm={6} md={3}>
          <ShopProductCard product={product} />
        </Grid>
      ))}

      {/* {SkeletonLoad} */}
    </Grid>
  );
}