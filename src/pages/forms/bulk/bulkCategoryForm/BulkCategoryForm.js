import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { paramCase } from 'change-case';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
// material
import { Container } from '@mui/material';

// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
import { PATH_DASHBOARD, PATH_ADMIN } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import CategoryNewForm from './components/Form';
import { loadBulkCategories } from '../../../../redux/slices/bulkCategories';

// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();

  const { bulkCategories } = useSelector((state) => state.bulkCategory);
  const isEdit = pathname.includes('edit');
  const currentCategory = bulkCategories.find((category) => paramCase(category.id) === id);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleBulkCategoryUpdate = async (v) => {
    setLoading(true);
    dispatch(
      loadBulkCategories(
        bulkCategories.map((res) => {
          if (res.id === v.id) {
            return (res = v);
          }
          return res;
        })
      )
    );
    navigate(-1);
  };

  return (
    <Page title="Ecommerce: Create a new category | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new category' : 'Edit category'}
          links={[
            {
              name: 'Categories List',
              href: PATH_ADMIN.directories.categories
            },
            { name: currentCategory?.name }
          ]}
        />

        <CategoryNewForm
          isEdit={isEdit}
          currentCategory={currentCategory}
          handleBulkCategoryUpdate={handleBulkCategoryUpdate}
          loading={loading}
        />
      </Container>
    </Page>
  );
}
