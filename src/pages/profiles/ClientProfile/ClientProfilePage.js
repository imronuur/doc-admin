// material
import { Grid, Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// hooks
import useSettings from '../../../hooks/useSettings';
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import { PATH_ADMIN } from '../../../routes/paths';
import { ClientAbout } from './components';
// --------------------------------------------

export default function RouteProfilePage() {
  const params = useParams();
  const { themeStretch } = useSettings();

  const { _id } = params;
  const { client, order } = useSelector((state) => ({ ...state }));
  const { clients } = client;
  const { orders } = order;

  let currentClient = null;
  let currentOrder = null;
  if (Array.isArray(clients.data)) {
    currentClient = clients.data.find((client) => client._id === _id);
  }
  if (Array.isArray(orders.data)) {
    currentOrder = orders.data.find((order) => order.orderTo === currentClient._id);
  }
  console.log(orders);

  return (
    <Page title="Client |  iDAN">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={`Client Profile -  ${currentClient.name}`}
          links={[
            { name: 'Dashboard', href: PATH_ADMIN.root },
            { name: 'Profiles Directory', href: PATH_ADMIN.directories.clients },
            { name: currentClient?.name || '' }
          ]}
        />

        <ClientAbout client={currentClient} order={currentOrder} />
      </Container>
    </Page>
  );
}
