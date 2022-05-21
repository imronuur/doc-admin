// material
import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// hooks
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
  const { order, auth } = useSelector((state) => ({ ...state }));
  const { orders } = order;

  let currentOrder = null;
  if (Array.isArray(orders.data)) {
    currentOrder = orders.data.find((client) => client._id === _id);
  }

  return (
    <Page title="Order |  iDAN">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Order Details"
          links={[
            { name: 'Dashboard', href: PATH_ADMIN.root },
            { name: 'Profiles Directory', href: PATH_ADMIN.directories.orders },
            { name: currentOrder?.orderStatus || '' }
          ]}
        />
        <OrdersAbout currentOrder={currentOrder} accessToken={auth.token} />
      </Container>
    </Page>
  );
}
