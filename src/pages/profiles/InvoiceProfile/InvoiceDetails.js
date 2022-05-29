import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_ADMIN } from '../../../routes/paths';
// _mock_
// import { _invoices } from '../../_mock';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

// sections
import Invoice from './details';

// ----------------------------------------------------------------------

export default function InvoiceDetails() {
  const { themeStretch } = useSettings();
  const { invoice, auth } = useSelector((state) => state);
  const { invoices } = invoice;
  const { user } = auth;
  const { id } = useParams();
  const currentInvoice = invoices.data.find((invoice) => invoice.id === id);

  return (
    <Page title="Invoice: View">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Invoice Details"
          links={[
            { name: 'Dashboard', href: PATH_ADMIN.root },
            {
              name: 'Invoices',
              href: PATH_ADMIN.directories.invoices
            },
            { name: currentInvoice?._id || '' }
          ]}
        />

        <Invoice invoice={currentInvoice} invoiceFrom={user} />
      </Container>
    </Page>
  );
}
