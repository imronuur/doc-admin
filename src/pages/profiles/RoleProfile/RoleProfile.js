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
import { RoleAbout } from './components';
// --------------------------------------------

export default function RouteProfilePage() {
  const params = useParams();
  const { themeStretch } = useSettings();

  const { _id } = params;
  const { role } = useSelector((state) => ({ ...state }));
  const { roles } = role;

  let currentRole = null;

  if (Array.isArray(roles.data)) {
    currentRole = roles.data.find((role) => role._id === _id);
  }

  return (
    <Page title="Role |  iDAN">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={`Role Profile - ${currentRole.name}`}
          links={[
            { name: 'Dashboard', href: PATH_ADMIN.root },
            { name: 'Roles Directory', href: PATH_ADMIN.directories.roles },
            { name: currentRole?.name || '' }
          ]}
        />

        <RoleAbout role={currentRole} />
      </Container>
    </Page>
  );
}
