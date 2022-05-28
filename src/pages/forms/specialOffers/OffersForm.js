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
import { createOffer } from '../../../redux/thunk/offerThunk';
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

  const { offers } = useSelector((state) => state.offer);
  const { token } = useSelector((state) => state.auth);

  const isEdit = pathname.includes('edit');
  const currentOffer = offers?.data.find((off) => paramCase(off._id) === _id);

  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isSubscribed = true;

    if (isSubscribed) {
      const loadProducts = async () => {
        const reqObject = {
          accessToken: token
        };
        const res = await getAllProducts(reqObject);
        setProducts(res.data);
      };

      loadProducts();
    }

    return () => (isSubscribed = false);
  }, []);

  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleCreate = async (offer) => {
    setLoading(true);

    const reqObject = {
      offer,
      accessToken: token
    };

    const reduxRes = await dispatch(createOffer(reqObject));
    if (reduxRes.type === 'offer/create/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'offer/create/fulfilled') {
      enqueueSnackbar(`Offer Created!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
      navigate(`${PATH_ADMIN.directories.offers}`);
    }
  };

  return (
    <Page title="Create a new offer | iDan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new offer' : 'Edit offer'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Offers List',
              href: PATH_ADMIN.directories.offers
            },
            { name: !isEdit ? 'New Offer' : currentOffer?.name }
          ]}
        />

        <Form
          isEdit={isEdit}
          currentOffer={currentOffer}
          products={products}
          handleCreate={handleCreate}
          loading={loading}
        />
      </Container>
    </Page>
  );
}
