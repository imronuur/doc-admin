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
import { createCategory } from '../../../redux/thunk/categoryThunk';
// routes
import { PATH_DASHBOARD, PATH_ADMIN } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import CategoryNewForm from './components/Form';

// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { _id } = useParams();
  const { categories } = useSelector((state) => state.category);
  const isEdit = pathname.includes('edit');
  const currentCategory = categories.find((category) => paramCase(category._id) === _id);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleCategoryCreate = async (name) => {
    setLoading(true);
    const reqObject = {
      name
    };
    const reduxRes = await dispatch(createCategory(reqObject));
    if (reduxRes.type === 'category/create/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'category/create/fulfilled') {
      enqueueSnackbar(`Category Created`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      navigate(`${PATH_ADMIN.directories.categories}`);
    }
  };

  return (
    <Page title="Ecommerce: Create a new category | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new category' : 'Edit category'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Categories List',
              href: PATH_ADMIN.directories.categories
            },
            { name: !isEdit ? 'New category' : currentCategory?.name }
          ]}
        />

        <CategoryNewForm
          isEdit={isEdit}
          currentCategory={currentCategory}
          handleCategoryCreate={handleCategoryCreate}
          loading={loading}
        />
      </Container>
    </Page>
  );
}
