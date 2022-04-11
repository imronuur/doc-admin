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
import { createInvoice } from '../../../redux/thunk/invoiceThunk';

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

  const { invoice } = useSelector((state) => state);
  const { invoices } = invoice;
  const isEdit = pathname.includes('edit');
  const currentInvoice = invoices?.data.find((cli) => paramCase(cli._id) === _id);

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

  const handleCreateInvoice = async (invoice) => {
    setLoading(true);
    console.log(invoice);
    const reqObject = {
      invoice
    };

    const reduxRes = await dispatch(createInvoice(reqObject));
    if (reduxRes.type === 'invoice/create/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'invoice/create/fulfilled') {
      enqueueSnackbar(`Invoice Created!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
      navigate(`${PATH_ADMIN.directories.invoices}`);
    }
  };

  return (
    <Page title="Create a new Invoice | iDan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new Invoice' : 'Edit Invoice'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Invoices List',
              href: PATH_ADMIN.directories.invoices
            },
            { name: !isEdit ? 'New Invoice' : currentInvoice?.name }
          ]}
        />

        <Form
          isEdit={isEdit}
          currentInvoice={currentInvoice}
          handleCreateInvoice={handleCreateInvoice}
          loading={loading}
        />
      </Container>
    </Page>
  );
}
