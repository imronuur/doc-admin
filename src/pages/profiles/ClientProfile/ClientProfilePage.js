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
  const { client } = useSelector((state) => ({ ...state }));
  const { clients } = client;

  let currentClient = null;
  if (Array.isArray(clients.data)) {
    currentClient = clients.data.find((client) => client._id === _id);
  }

  console.log(currentClient);

  return (
    <Page title="Client | Fleet Management">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={`Client Profile ${_id}`}
          links={[
            { name: 'Dashboard', href: PATH_ADMIN.root },
            { name: 'Routes Directory', href: PATH_ADMIN.directories.clients },
            { name: currentClient?.name || '' }
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ClientAbout client={currentClient} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
