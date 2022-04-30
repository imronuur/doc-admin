import _, { filter, sumBy } from 'lodash';

import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import { Link as RouterLink } from 'react-router-dom';
import { sentenceCase } from 'change-case';
import { useTheme, styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Tabs,
  Tab,
  Table,
  Button,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  Grid,
  Stack,
  Divider,
  Chip
} from '@mui/material';
import LoadingScreen from '../../../components/LoadingScreen';
// redux
import { useDispatch, useSelector } from '../../../redux/store';

import { fCurrency } from '../../../utils/formatNumber';
import useTabs from '../../../hooks/useTabs';
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
import { InvoiceListHead, InvoiceMoreMenu, InvoiceTableToolbar, InvoiceAnalytic } from './components';
import { getInvoice } from '../../../redux/slices/invoiceSlice';
import { deleteInvoice, deleteManyInvoices } from '../../../redux/thunk/invoiceThunk';
import ClientAvatar from './components/ClientAvatar';

// ----------------------------------------------------------------------

let content = null;

const SERVICE_OPTIONS = [
  'all',
  'full stack development',
  'backend development',
  'ui design',
  'ui/ux design',
  'front end development'
];

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Client', align: 'left' },
  { id: 'refTo', label: 'Ref to', align: 'left' },
  { id: 'dateCreated', label: 'Created Date', align: 'left' },
  { id: 'dueDate', label: 'Due Date', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'price', label: 'Total', align: 'center', width: 140 },
  { id: 'status', label: 'Status', align: 'left' },
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

function applySortFilter(array, comparator, filterName, filterService, filterStatus, filterStartDate, filterEndDate) {
  const stabilizedThis = array.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  array = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    array = array.filter((item) => item.refTo.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterService !== 'all') {
    array = array.filter((item) => item.items.some((c) => c.service === filterService));
  }

  if (filterStatus !== 'All') {
    array = array.filter((item) => item.status === filterStatus);
  }

  if (filterStartDate && filterEndDate) {
    array = array.filter(
      (item) =>
        new Date(item.dateCreated).getTime() >= filterStartDate.getTime() &&
        new Date(item.dateCreated).getTime() <= filterEndDate.getTime()
    );
  }

  return array;
}

// ----------------------------------------------------------------------

export default function InvoiceList() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { invoice } = useSelector((state) => state);
  const { invoices } = invoice;
  const { clients } = useSelector((state) => state.client);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterService, setFilterService] = useState('all');
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('All');

  // const dataFiltered = applySortFilter({
  //   invoices,
  //   comparator: getComparator(order, orderBy),
  //   filterName,
  //   filterService,
  //   filterStatus,
  //   filterStartDate,
  //   filterEndDate
  // });
  // const isNotFound =
  //   (!dataFiltered.length && !!filterName) ||
  //   (!dataFiltered.length && !!filterStatus) ||
  //   (!dataFiltered.length && !!filterService) ||
  //   (!dataFiltered.length && !!filterEndDate) ||
  //   (!dataFiltered.length && !!filterStartDate);

  const getLengthByStatus = (status) => invoices.data.filter((item) => item.status === status).length;

  const getTotalPriceByStatus = (status) => {
    const total = invoices.data.filter((item) => item.status === status).reduce((acc, item) => acc + item.total, 0);
    return fCurrency(total);
  };

  const getAllTotalPrice = (status) => {
    if (status === 'All') {
      const total = invoices.data.reduce((acc, item) => acc + item.total, 0);
      return fCurrency(total);
    }
  };
  // const getTotal = (status) => {
  //   sumBy(
  //     invoices.data.filter((item) => item.status === status),
  //     'totalPrice'
  //   );
  // };

  const getPercentByStatus = (status) => (getLengthByStatus(status) / invoices.data.length) * 100;
  const TABS = [
    { value: 'All', label: 'All', color: 'info', count: invoices.data.length },
    { value: 'Paid', label: 'Paid', color: 'success', count: getLengthByStatus('Paid') },
    { value: 'Unpaid', label: 'Unpaid', color: 'warning', count: getLengthByStatus('Unpaid') },
    { value: 'Overdue', label: 'Overdue', color: 'error', count: getLengthByStatus('Overdue') },
    { value: 'Draft', label: 'Draft', color: 'default', count: getLengthByStatus('Draft') }
  ];

  const pages = new Array(invoice.numberOfPages).fill(null).map((v, i) => i);
  const gotoPrevious = () => {
    setPage(Math.max(0, page - 1));
  };
  const handleFilterByName = (event) => {
    console.log(event);
    setFilterName(event);
  };
  const handleFilterService = (event) => {
    setFilterService(event.target.value);
  };

  const gotoNext = () => {
    setPage(Math.min(invoice.numberOfPages - 1, page + 1));
  };

  useEffect(() => {
    const reqObject = {
      page
    };
    dispatch(getInvoice(reqObject));
  }, [dispatch, page]);

  if (invoices?.data.length) {
    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelecteds = invoices.data.map((n) => n._id);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    };

    const handleDeleteInvoice = async (_id) => {
      const reqObject = {
        _id
      };
      const reduxRes = await dispatch(deleteInvoice(reqObject));
      if (reduxRes.type === 'invoice/delete/rejected') {
        enqueueSnackbar(`${reduxRes.error.message}`, {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      } else if (reduxRes.type === 'invoice/delete/fulfilled') {
        enqueueSnackbar(`Invoice Deleted!`, {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        dispatch(getInvoice({ page }));
      }
    };

    const handleDeleteMany = async (ids) => {
      setLoading(true);
      const reqObject = {
        ids
      };
      const reduxRes = await dispatch(deleteManyInvoices(reqObject));
      if (reduxRes.type === 'invoices/delete-many/rejected') {
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
        enqueueSnackbar(`Invoices Deleted!`, {
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
    const filteredInvoices = applySortFilter(
      invoices.data,
      getComparator(order, orderBy),
      filterName,
      filterService,
      filterStatus,
      filterStartDate,
      filterEndDate
    );
    const isInvoiceNotFound = filteredInvoices.length === 0;

    content = (
      <>
        <Card sx={{ mb: 5 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <InvoiceAnalytic
                title="Total"
                total={invoices.data.length}
                percent={100}
                price={getAllTotalPrice('All')}
                tableData
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />
              <InvoiceAnalytic
                title="Paid"
                total={getLengthByStatus('Paid')}
                percent={getPercentByStatus('Paid')}
                price={getTotalPriceByStatus('Paid')}
                icon="eva:checkmark-circle-2-fill"
                color={theme.palette.success.main}
              />
              <InvoiceAnalytic
                title="Unpaid"
                total={getLengthByStatus('Unpaid')}
                percent={getPercentByStatus('Unpaid')}
                price={getTotalPriceByStatus('Unpaid')}
                icon="eva:clock-fill"
                color={theme.palette.warning.main}
              />
              <InvoiceAnalytic
                title="Overdue"
                total={getLengthByStatus('Overdue')}
                percent={getPercentByStatus('Overdue')}
                price={getTotalPriceByStatus('Overdue')}
                icon="eva:bell-fill"
                color={theme.palette.error.main}
              />
              <InvoiceAnalytic
                title="Draft"
                total={getLengthByStatus('Draft')}
                percent={getPercentByStatus('Draft')}
                price={getTotalPriceByStatus('Draft')}
                icon="eva:file-fill"
                color={theme.palette.text.secondary}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Divider />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                value={tab.value}
                label={
                  <Stack spacing={1} direction="row" alignItems="center">
                    <div>{tab.label}</div> <Label color={tab.color}> {tab.count} </Label>
                  </Stack>
                }
              />
            ))}
          </Tabs>

          <Divider />

          <InvoiceTableToolbar
            filterName={filterName}
            filterService={filterService}
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            onFilterName={handleFilterByName}
            onFilterService={handleFilterService}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
            optionsService={SERVICE_OPTIONS}
            handleDeleteMany={handleDeleteMany}
            selected={selected}
            loading={loading}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <InvoiceListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={invoices.data.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredInvoices.map((row) => {
                    const { _id, refTo, dateCreated, dueDate, items, type, status } = row;

                    const total = items.map((item) => {
                      const { quantity, unitPrice, discount } = item;
                      const totalPrice = Number(quantity) * Number(unitPrice);
                      const price = totalPrice - totalPrice * (discount / 100);
                      return price;
                    });
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
                            {clients.data.map((client) => (
                              <Typography variant="subtitle2" noWrap key={client._id}>
                                {client._id === refTo && <ClientAvatar client={clients.data} />}
                              </Typography>
                            ))}
                          </Box>
                        </TableCell>
                        {/* {clients.data.map((client) => (
                          ))} */}
                        <TableCell>{refTo}</TableCell>
                        <TableCell>{dateCreated}</TableCell>
                        <TableCell>{dueDate}</TableCell>
                        <TableCell>
                          <Chip label={type} color="success" variant="outlined" />
                        </TableCell>
                        <TableCell>{fCurrency(total)}</TableCell>
                        <TableCell>
                          <Chip label={status} />
                        </TableCell>
                        <TableCell align="right">
                          <InvoiceMoreMenu onDelete={() => handleDeleteInvoice(_id)} _id={_id} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                {isInvoiceNotFound && (
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
          {invoices.data.length > 0 && (
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
      </>
    );
  } else if (invoice.isLoading) {
    content = (
      <Card sx={{ padding: '10%' }}>
        <LoadingScreen />
      </Card>
    );
  } else {
    content = (
      <Card>
        <Typography py={4} px={10}>
          No Invoice Found
        </Typography>
      </Card>
    );
  }

  return (
    <Page title="Invoice List | iDan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Invoice List"
          links={[{ name: 'Dashboard', href: PATH_ADMIN.directories.invoices }, { name: 'Invoice List' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_ADMIN.forms.newInvoice}
              startIcon={<Icon icon={plusFill} />}
            >
              New Invoice
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
