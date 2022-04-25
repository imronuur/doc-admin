// material
import { Grid, Container, Icon } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// hooks
import shopFilled from '@iconify/icons-ant-design/shop-filled';
import useSettings from '../../../hooks/useSettings';
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import { PATH_ADMIN } from '../../../routes/paths';
import { OrdersAbout } from './components';

// --------------------------------------------

export default function RouteProfilePage() {
  const params = useParams();
  const { themeStretch } = useSettings();

  const { _id } = params;
  const { product } = useSelector((state) => ({ ...state }));
  const { products } = product;

  let currentOrder = null;
  if (Array.isArray(products.data)) {
    currentOrder = products.data.find((client) => client._id === _id);
  }

  return (
    <Page title="Order |  iDAN">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Order Details"
          links={[
            { name: 'Dashboard', href: PATH_ADMIN.root },
            { name: 'Profiles Directory', href: PATH_ADMIN.directories.orders },
            { name: currentOrder?.name || '' }
          ]}
        />
        <OrdersAbout order={currentOrder} />
      </Container>
    </Page>
  );
}
