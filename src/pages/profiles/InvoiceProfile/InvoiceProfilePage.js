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
  const { invoice, order } = useSelector((state) => ({ ...state }));
  const { invoices } = invoice;
  // const { orders } = order;

  let currentInvoice = null;
  // let currentOrder = null;
  if (Array.isArray(invoices.data)) {
    currentInvoice = invoices.data.find((client) => client._id === _id);
  }
  // if (Array.isArray(orders.data)) {
  //   currentOrder = orders.data.find((order) => order.orderTo === currentClient._id);
  // }

  return (
    <Page title="Client |  iDAN">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={`Invoice Profile ${_id}`}
          links={[
            { name: 'Dashboard', href: PATH_ADMIN.root },
            { name: 'Profiles Directory', href: PATH_ADMIN.directories.invoices },
            { name: currentInvoice?.name || '' }
          ]}
        />

        <ClientAbout
          invoice={currentInvoice}
          // order={currentOrder}
        />
      </Container>
    </Page>
  );
}
