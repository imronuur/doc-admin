import { filter } from 'lodash';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
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
  Grid
} from '@mui/material';
import LoadingScreen from '../../../components/LoadingScreen';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getCategories } from '../../../redux/slices/categories';
import { getCoupon } from '../../../redux/slices/couponSlice';

// routes
import { PATH_DASHBOARD, PATH_ADMIN } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { MIconButton } from '../../../components/@material-extend';
import { deleteCoupon, deleteManyCoupons } from '../../../redux/thunk/couponThunk';
import { CouponsListHead, CouponsListToolbar, CouponsMoreMenu } from './components';

// ----------------------------------------------------------------------

let content = null;

const TABLE_HEAD = [
  { id: 'name', label: 'Coupon Code Name', align: 'left' },
  { id: 'expiryDate', label: 'Expiry Date', align: 'left' },
  { id: 'discount', label: 'Discount Amount', align: 'left' },
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
    return filter(array, (_product) => _product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

export default function CategoryList() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { coupon } = useSelector((state) => state);
  const { codes } = coupon;
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const pages = new Array(codes.numberOfPages).fill(null).map((v, i) => i);
  const gotoPrevious = () => {
    setPage(Math.max(0, page - 1));
  };

  const gotoNext = () => {
    setPage(Math.min(codes.numberOfPages - 1, page + 1));
  };

  useEffect(() => {
    const reqObject = {
      page
    };
    dispatch(getCoupon(reqObject));
  }, [dispatch, page]);

  if (codes?.data.length) {
    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelecteds = codes.data.map((n) => n._id);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    };

    const handleDeleteOne = async (_id) => {
      const reqObject = {
        _id
      };
      const reduxRes = await dispatch(deleteCoupon(reqObject));
      if (reduxRes.type === 'coupon/delete/rejected') {
        enqueueSnackbar(`${reduxRes.error.message}`, {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      } else if (reduxRes.type === 'coupon/delete/fulfilled') {
        enqueueSnackbar(`Coupon Deleted!`, {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        dispatch(getCoupon({ page }));
      }
    };

    const handleDeleteMany = async (ids) => {
      setLoading(true);
      const reqObject = {
        ids
      };
      const reduxRes = await dispatch(deleteManyCoupons(reqObject));
      if (reduxRes.type === 'coupons/delete-many/rejected') {
        enqueueSnackbar(`${reduxRes.error.message}`, {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        setLoading(false);
      } else if (reduxRes.type === 'coupons/delete-many/fulfilled') {
        enqueueSnackbar(`Coupons Deleted!`, {
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
      console.log(event, name);
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

    const filteredCoupons = applySortFilter(codes.data, getComparator(order, orderBy), filterName);

    const Coupon = filteredCoupons.length === 0;

    content = (
      <Card>
        <CouponsListToolbar
          handleDeleteMany={handleDeleteMany}
          loading={loading}
          selected={selected}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <CouponsListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={codes.data.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredCoupons.map((row) => {
                  const { _id, name, expiryDate, discount } = row;
                  console.log(row);
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
                      <TableCell>{expiryDate}</TableCell>
                      <TableCell>{discount}</TableCell>

                      <TableCell align="right">
                        <CouponsMoreMenu onDelete={() => handleDeleteOne(_id)} _id={_id} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              {Coupon && (
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
        {codes.data.length > 0 && (
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
  } else if (codes.isLoading) {
    content = (
      <Card sx={{ padding: '10%' }}>
        <LoadingScreen />
      </Card>
    );
  } else {
    content = (
      <Card>
        <Typography px={20} py={4}>
          No Coupons Code Found
        </Typography>
      </Card>
    );
  }

  return (
    <Page title="Ecommerce: Coupon Code List | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Coupon Code List"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Coupon Code List' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_ADMIN.forms.newCoupon}
              startIcon={<Icon icon={plusFill} />}
            >
              New Coupon
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
