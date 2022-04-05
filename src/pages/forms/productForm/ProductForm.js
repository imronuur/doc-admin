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
import { createProduct } from '../../../redux/thunk/productThunk';
import { getAllCategories, getAllSubCategories, loadSubCategory } from '../../../redux/slices/subCategories';

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
  const { products } = useSelector((state) => state.product);
  const isEdit = pathname.includes('edit');
  const currentProduct = products.data.find((product) => paramCase(product._id) === _id);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const res = await getAllCategories();
      setCategories(res.data);
    };
    const loadSubCategories = async () => {
      const res = await getAllSubCategories();
      setSubCategories(res.data);
    };
    loadCategories();
    loadSubCategories();
  }, []);

  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleCreate = async (product) => {
    setLoading(true);

    const reqObject = {
      product: {
        ...product,
        subCategories: []
      }
    };

    product.subCategories.map((res) => reqObject.product.subCategories.push(res._id));

    const reduxRes = await dispatch(createProduct(reqObject));
    if (reduxRes.type === 'product/create/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'product/create/fulfilled') {
      enqueueSnackbar(`Product Created!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
      navigate(`${PATH_ADMIN.directories.products}`);
    }
  };

  return (
    <Page title="Create a new product | iDan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new product' : 'Edit product'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Product List',
              href: PATH_ADMIN.directories.products
            },
            { name: !isEdit ? 'New product' : currentProduct?.name }
          ]}
        />

        <Form
          categories={categories}
          subCategories={subCategories}
          isEdit={isEdit}
          currentProduct={currentProduct}
          handleCreate={handleCreate}
          loading={loading}
        />
      </Container>
    </Page>
  );
}
