import { filter } from 'lodash';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import closeFill from '@iconify/icons-eva/close-fill';

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
  Grid,
  Chip
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

import { getOrders } from '../../../redux/slices/orderSlice';
import { deleteOrder, deleteManyOrders, updateOrderStatus } from '../../../redux/thunk/orderThunk';
import { OrdersListHead, OrdersListToolbar, OrdersMoreMenu, OrdersModal } from './components';
import { fCurrency } from '../../../utils/formatNumber';
// ----------------------------------------------------------------------

let content = null;

const TABLE_HEAD = [
  { id: 'orderNum', label: 'Order #', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'createdAt', label: 'Date Purchased', align: 'left' },
  { id: 'total', label: 'Total', align: 'left' },

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
    return filter(array, (_product) => _product.orderStatus?.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

export default function OrdersList() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { order, auth } = useSelector((state) => state);
  const { orders } = order;
  const { token } = auth;
  const [page, setPage] = useState(0);
  const [orderAsc, setOrderAsc] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenModal = async () => {
    handleOpen();
  };
  const handleUpdateOrder = async (status) => {
    setLoading(true);
    const reqObject = {
      status,
      accessToken: token
    };
    const reduxRes = await dispatch(updateOrderStatus(reqObject));
    if (reduxRes.type === 'update-order-status/update/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'update-order-status/update/fulfilled') {
      enqueueSnackbar(`Order Status Updated!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    }
    window.location.reload();
  };

  const pages = new Array(orders.numberOfPages).fill(null).map((v, i) => i);
  const gotoPrevious = () => {
    setPage(Math.max(0, page - 1));
  };

  const gotoNext = () => {
    setPage(Math.min(orders.numberOfPages - 1, page + 1));
  };

  const handleDeleteOrder = async (_id) => {
    const reqObject = {
      _id,
      accessToken: token
    };
    const reduxRes = await dispatch(deleteOrder(reqObject));
    if (reduxRes.type === 'order/delete/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    } else if (reduxRes.type === 'order/delete/fulfilled') {
      enqueueSnackbar(`Order Deleted!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });

      dispatch(getOrders({ page }));
    }
  };

  useEffect(() => {
    const reqObject = {
      page,
      accessToken: token
    };
    dispatch(getOrders(reqObject));
  }, [dispatch, page, token]);

  const handleDeleteMany = async (ids) => {
    setLoading(true);
    const reqObject = {
      ids,
      accessToken: token
    };
    const reduxRes = await dispatch(deleteManyOrders(reqObject));
    if (reduxRes.type === 'orders/delete-many/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'orders/delete-many/fulfilled') {
      enqueueSnackbar(`Orders Deleted!`, {
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

  if (orders?.data?.length) {
    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrderAsc(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelecteds = orders.data.map((n) => n._id);
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

    const filteredOrder = applySortFilter(orders.data, getComparator(order, orderBy), filterName);

    const isOrderNotFound = filteredOrder.length === 0;

    content = (
      <Card>
        <OrdersListToolbar
          handleDeleteMany={handleDeleteMany}
          loading={loading}
          selected={selected}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <OrdersListHead
                order={orderAsc}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={orders.data.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredOrder.map((row) => {
                  const { _id, address, createdAt, orderInfo, orderStatus } = row;

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
                            {address[0].fullAddress}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          // variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                          color={
                            (orderStatus === 'Cancelled' && 'error') ||
                            (orderStatus === 'Dispatched' && 'warning') ||
                            (orderStatus === 'Completed' && 'success') ||
                            (orderStatus === 'Not Processed' && 'default') ||
                            (orderStatus === 'processing' && 'primary') ||
                            (orderStatus === 'Cash On Delivery' && 'secondary')
                          }
                          label={orderStatus}
                        />
                      </TableCell>

                      <TableCell>{createdAt}</TableCell>

                      <TableCell>{fCurrency(orderInfo?.total)}</TableCell>

                      <TableCell align="right">
                        <OrdersMoreMenu
                          onOpen={() => handleOpenModal()}
                          onDelete={() => handleDeleteOrder(_id)}
                          _id={_id}
                        />
                      </TableCell>
                      {/* orders modal */}
                      <OrdersModal
                        open={open}
                        handleClose={handleClose}
                        orderId={_id}
                        handleUpdateOrder={handleUpdateOrder}
                      />
                      {/* orders modal */}
                    </TableRow>
                  );
                })}
              </TableBody>
              {isOrderNotFound && (
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
        {orders.data.length > 0 && (
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
  } else if (order.isLoading) {
    content = (
      <Card sx={{ padding: '10%' }}>
        <LoadingScreen />
      </Card>
    );
  } else {
    content = (
      <Card>
        <Typography px={10} py={4}>
          No Orders found
        </Typography>
      </Card>
    );
  }

  return (
    <Page title="Orders List | iDan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Orders List"
          links={[{ name: 'Dashboard', href: PATH_ADMIN.directories.orders }, { name: 'Orders List' }]}
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
