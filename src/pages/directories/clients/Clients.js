import { filter } from 'lodash';
import slugify from 'react-slugify';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { parse as csvparse } from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import closeFill from '@iconify/icons-eva/close-fill';
import { sentenceCase } from 'change-case';
import { useTheme, styled } from '@mui/material/styles';

import {
  Box,
  Card,
  Table,
  Button,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  Grid
} from '@mui/material';
import LoadingScreen from '../../../components/LoadingScreen';
// redux
import { useDispatch, useSelector } from '../../../redux/store';

// routes
import { PATH_ADMIN } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { MIconButton } from '../../../components/@material-extend';
import Label from '../../../components/Label';

import { getClients } from '../../../redux/slices/clients';
import { deleteClient, deleteManyClients } from '../../../redux/thunk/clientsThunk';
import ClientListToolbar from './components/ClientsListToolbar';
import ClientListHead from './components/ClientsListHead';
import ClientMoreMenu from './components/ClientsMoreMenu';

// ----------------------------------------------------------------------

let content = null;

const TABLE_HEAD = [
  { id: 'name', label: 'Full Name', align: 'left' },
  { id: 'email', label: 'Email Address', align: 'left' },
  { id: 'phone', label: 'Phone Number', align: 'left' },
  { id: 'state', label: 'State', align: 'left' },
  { id: 'company', label: 'Company', align: 'left' },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  if (query) {
    return filter(
      array,
      (_product) =>
        _product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _product?.category?.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

export default function ClientList() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { client } = useSelector((state) => state);

  const { clients } = client;

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const pages = new Array(clients.numberOfPages).fill(null).map((v, i) => i);
  const gotoPrevious = () => {
    setPage(Math.max(0, page - 1));
  };

  const gotoNext = () => {
    setPage(Math.min(clients.numberOfPages - 1, page + 1));
  };

  const handleDeleteClient = async (_id) => {
    const reqObject = {
      _id
    };
    const reduxRes = await dispatch(deleteClient(reqObject));
    if (reduxRes.type === 'clients/delete/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    } else if (reduxRes.type === 'clients/delete/fulfilled') {
      enqueueSnackbar(`Client Deleted!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });

      dispatch(getClients({ page }));
    }
  };

  useEffect(() => {
    const reqObject = {
      page
    };
    dispatch(getClients(reqObject));
  }, [dispatch, page]);

  const handleDeleteMany = async (ids) => {
    setLoading(true);
    const reqObject = {
      ids
    };
    const reduxRes = await dispatch(deleteManyClients(reqObject));
    if (reduxRes.type === 'clients/delete-many/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'clients/delete-many/fulfilled') {
      enqueueSnackbar(`Clients Deleted!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      window.location.reload();
    }
  };

  if (clients?.clients.length) {
    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelecteds = clients.clients.map((n) => n._id);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    };

    const handleClick = (event, name) => {
      const selectedIndex = selected.indexOf(name);
      let newSelected = [];
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, name);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
      }
      setSelected(newSelected);
    };

    const handleFilterByName = (event) => {
      setFilterName(event.target.value);
    };

    const filteredCleints = applySortFilter(clients.clients, getComparator(order, orderBy), filterName);

    const isClientNotFound = filteredCleints.length === 0;

    content = (
      <Card>
        <ClientListToolbar
          handleDeleteMany={handleDeleteMany}
          loading={loading}
          selected={selected}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <ClientListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={clients.clients.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredCleints.map((row) => {
                  const { _id, name, email, phone, state, company } = row;

                  const isItemSelected = selected.indexOf(_id) !== -1;

                  return (
                    <TableRow
                      hover
                      key={_id}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, _id)} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        <Box
                          sx={{
                            py: 2,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>{email}</TableCell>
                      <TableCell>{phone}</TableCell>

                      <TableCell>{state}</TableCell>
                      <TableCell>{company}</TableCell>

                      <TableCell align="right">
                        <ClientMoreMenu onDelete={() => handleDeleteClient(_id)} _id={_id} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              {isClientNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6}>
                      <Box sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>
        {clients.clients.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '1%'
            }}
          >
            <Button onClick={gotoPrevious} disabled={page <= 0}>
              Previous
            </Button>
            {pages.map((pageIndex) => (
              <Button
                key={pageIndex}
                onClick={() => setPage(pageIndex)}
                color={pageIndex === page ? 'warning' : 'success'}
              >
                {pageIndex + 1}
              </Button>
            ))}
            <Button onClick={gotoNext}>Next</Button>
          </Box>
        )}
      </Card>
    );
  } else if (clients.clients.isLoading) {
    content = (
      <Card sx={{ padding: '10%' }}>
        <LoadingScreen />
      </Card>
    );
  } else {
    content = (
      <Card>
        <Typography px={20} py={4}>
          No Clients found
        </Typography>
      </Card>
    );
  }

  return (
    <Page title="Clients List | iDan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Clients List"
          links={[{ name: 'Dashboard', href: PATH_ADMIN.directories.clients }, { name: 'Clients List' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_ADMIN.forms.newClients}
              startIcon={<Icon icon={plusFill} />}
            >
              New Client
            </Button>
          }
        />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {content}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
