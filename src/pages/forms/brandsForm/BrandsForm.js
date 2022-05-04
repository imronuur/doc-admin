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
import { createBrand } from '../../../redux/thunk/brandsThunk';
import { getAllProducts } from '../../../redux/slices/products';

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

  const { brands } = useSelector((state) => state.brand);

  const isEdit = pathname.includes('edit');
  const currentBrand = brands?.data.find((off) => paramCase(off._id) === _id);

  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   let isSubscribed = true;

  //   if (isSubscribed) {
  //     const loadProducts = async () => {
  //       const res = await getAllProducts();
  //       setProducts(res.data);
  //     };

  //     loadProducts();
  //   }

  //   return () => (isSubscribed = false);
  // }, []);

  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleCreate = async (brand) => {
    setLoading(true);

    const reqObject = {
      brand
    };

    const reduxRes = await dispatch(createBrand(reqObject));
    if (reduxRes.type === 'brand/create/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'brand/create/fulfilled') {
      enqueueSnackbar(`Brand Created!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
      navigate(`${PATH_ADMIN.directories.brands}`);
    }
  };

  return (
    <Page title="Create a new brand | iDan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new brand' : 'Edit Brand'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Brands List',
              href: PATH_ADMIN.directories.brands
            },
            { name: !isEdit ? 'New Brand' : currentBrand?.name }
          ]}
        />

        <Form isEdit={isEdit} currentBrand={currentBrand} handleCreate={handleCreate} loading={loading} />
      </Container>
    </Page>
  );
}
