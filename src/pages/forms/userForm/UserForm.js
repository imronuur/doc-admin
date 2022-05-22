import { useState, useEffect } from 'react';
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
import { createUser } from '../../../redux/thunk/usersThunk';
import { getAllRoles } from '../../../redux/slices/roleSlice';

// routes
import { PATH_DASHBOARD, PATH_ADMIN } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Form from './components/Form';

// ----------------------------------------------------------------------

export default function ClientsForm() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { _id } = useParams();

  const { user, role, auth } = useSelector((state) => state);
  const { users } = user;
  const { roles } = role;
  const { token } = auth;

  useEffect(() => {
    const reqObject = {
      page: 0,
      authToken: token
    };
    dispatch(getAllRoles(reqObject));
  }, [token, dispatch]);

  const isEdit = pathname.includes('edit');
  const currentUser = users?.data.find((user) => paramCase(user._id) === _id);

  const [loading, setLoading] = useState(false);

  // const [client, setClient] = useState([]);

  // useEffect(() => {
  //   const loadClients = async () => {
  //     const res = await getClients();
  //     setClient(res.data);
  //   };
  //   loadClients();
  // }, []);

  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleCreate = async (user) => {
    setLoading(true);

    const reqObject = {
      user,
      authToken: token
    };

    const reduxRes = await dispatch(createUser(reqObject));
    if (reduxRes.type === 'user/createOrUpdate/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'user/createOrUpdate/fulfilled') {
      enqueueSnackbar(`User Created!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
      navigate(`${PATH_ADMIN.directories.users}`);
    }
  };

  return (
    <Page title="Create a new user | iDan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new user' : 'Edit user'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Users List',
              href: PATH_ADMIN.directories.users
            },
            { name: !isEdit ? 'New Users' : currentUser?.name }
          ]}
        />

        <Form
          isEdit={isEdit}
          roles={roles.data}
          currentUser={currentUser}
          handleCreate={handleCreate}
          loading={loading}
        />
      </Container>
    </Page>
  );
}
