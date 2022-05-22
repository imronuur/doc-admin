import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { paramCase } from 'change-case';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
// material
import { Icon } from '@iconify/react';
import { Container } from '@mui/material';
import closeFill from '@iconify/icons-eva/close-fill';
import { MIconButton } from '../../../components/@material-extend';

// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { createRole } from '../../../redux/thunk/rolesThunk';

// routes
import { PATH_DASHBOARD, PATH_ADMIN } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Form from './components/Form';

// ----------------------------------------------------------------------

export default function ProductForm() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { _id } = useParams();
  const { roles } = useSelector((state) => state.role);
  const { token } = useSelector((state) => state.auth);
  const isEdit = pathname.includes('edit');
  const currentRole = roles.data.find((role) => paramCase(role._id) === _id);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleCreate = async (role) => {
    setLoading(true);
    const reqObject = {
      role,
      authToken: token
    };

    const reduxRes = await dispatch(createRole(reqObject));
    if (reduxRes.type === 'role/createOrUpdate/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'role/createOrUpdate/fulfilled') {
      enqueueSnackbar(`Role Created!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
      navigate(`${PATH_ADMIN.directories.roles}`);
    }
  };

  return (
    <Page title="Create a new role | iDan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new role' : 'Edit role'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Role List',
              href: PATH_ADMIN.directories.roles
            },
            { name: !isEdit ? 'New role' : currentRole?.name }
          ]}
        />

        <Form isEdit={isEdit} currentRole={currentRole} handleCreate={handleCreate} loading={loading} />
      </Container>
    </Page>
  );
}
