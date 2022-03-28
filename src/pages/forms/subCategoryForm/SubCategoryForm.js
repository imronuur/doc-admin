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
import { createSubCategory } from '../../../redux/thunk/subCategoryThunk';
import { getAllCategories } from '../../../redux/slices/subCategories';

// routes
import { PATH_DASHBOARD, PATH_ADMIN } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import SubCategoryNewForm from './components/Form';
// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { _id } = useParams();
  const { subCategory } = useSelector((state) => state);
  const { subCategories } = subCategory;
  const isEdit = pathname.includes('edit');
  const currentSubCategory = subCategories.data.find((sub) => paramCase(sub._id) === _id);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const res = await getAllCategories();
      setCategories(res.data);
    };
    loadCategories();
  }, []);

  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleSubCategoryCreate = async (sub) => {
    setLoading(true);
    const reqObject = {
      sub
    };
    const reduxRes = await dispatch(createSubCategory(reqObject));
    if (reduxRes.type === 'subCategory/create/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'subCategory/create/fulfilled') {
      enqueueSnackbar(`Sub Category Created!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
      navigate(`${PATH_ADMIN.directories.categories}`);
    }
  };

  return (
    <Page title="Create a new sub category | iDan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new sub category' : 'Edit sub category'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Categories List',
              href: PATH_ADMIN.directories.categories
            },
            { name: !isEdit ? 'New Sub Category' : currentSubCategory?.name }
          ]}
        />

        <SubCategoryNewForm
          isEdit={isEdit}
          currentSubCategory={currentSubCategory}
          handleSubCategoryCreate={handleSubCategoryCreate}
          loading={loading}
          categories={categories}
        />
      </Container>
    </Page>
  );
}
