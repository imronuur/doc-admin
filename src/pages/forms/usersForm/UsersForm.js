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
import { getUsersSlice } from '../../../redux/slices/usersSlice';
import { createUser } from '../../../redux/thunk/usersThunk';

// routes
import { PATH_DASHBOARD, PATH_ADMIN } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Form from './components/Form';

// ----------------------------------------------------------------------

export default function UsersForm() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { _id } = useParams();
  const { user } = useSelector((state) => state.user);
  const isEdit = pathname.includes('edit');
  const currentUser = user?.data.find((user) => paramCase(user._id) === _id);

  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   const loadUsers = async () => {
  //     const res = await getUsersSlice();
  //     setUsers(res.data);
  //   };
  //   loadUsers();
  // }, []);

  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleCreate = async (user) => {
    setLoading(true);

    const reqObject = {
      user: {
        ...user
      }
    };

    const reduxRes = await dispatch(createUser(reqObject));
    if (reduxRes.type === 'user/create/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'user/create/fulfilled') {
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
    <Page title="Create a new product | iDan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new user' : 'Edit User'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Users List',
              href: PATH_ADMIN.directories.users
            },
            { name: !isEdit ? 'New User' : currentUser?.name }
          ]}
        />

        <Form users={users} isEdit={isEdit} currentUser={currentUser} handleCreate={handleCreate} loading={loading} />
      </Container>
    </Page>
  );
}
