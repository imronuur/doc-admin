// material
import { Grid, Container, Card } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// hooks
import useSettings from '../../../hooks/useSettings';
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import { PATH_ADMIN } from '../../../routes/paths';
import { ProductDetailsSumary, ProductDetailsCarousel } from './components/product-details';
// --------------------------------------------

export default function RouteProfilePage() {
  const params = useParams();
  const { themeStretch } = useSettings();

  const { _id } = params;
  const { product } = useSelector((state) => ({ ...state }));
  const { products } = product;

  let currentProduct = null;
  if (Array.isArray(products.data)) {
    currentProduct = products.data.find((p) => p._id === _id);
  }

  return (
    <Page title="Product |  iDAN">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={`Product Profile :- ${currentProduct?.name}`}
          links={[
            { name: 'Dashboard', href: PATH_ADMIN.root },
            { name: 'Products', href: PATH_ADMIN.directories.products },
            { name: currentProduct?.name || '' }
          ]}
        />

        <Card>
          <Grid container>
            <Grid item xs={12} md={6} lg={7}>
              <ProductDetailsCarousel currentProduct={currentProduct} />
            </Grid>
            <Grid item xs={12} md={6} lg={5}>
              <ProductDetailsSumary currentProduct={currentProduct} />
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Page>
  );
}
