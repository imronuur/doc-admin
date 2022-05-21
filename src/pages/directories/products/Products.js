import { filter } from 'lodash';
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
  Stack,
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
import { getProducts } from '../../../redux/slices/products';
import { loadBulkProducts, removeBulkProducts } from '../../../redux/slices/bulkProducts';
import { deleteProduct, createBulkProduct, deleteManyProducts } from '../../../redux/thunk/productThunk';

import { fCurrency } from '../../../utils/formatNumber';

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

import { ProductListHead, ProductListToolbar, ProductMoreMenu } from './components';
import { BulkProductAdd } from '../../bulk/BulkProductAdd';

// ----------------------------------------------------------------------

let content = null;

const TABLE_HEAD = [
  { id: 'name', label: 'Product', align: 'left' },
  { id: 'category', label: 'Category', align: 'left' },
  { id: 'salePrice', label: 'Sale Price', align: 'left' },
  { id: 'quantity', label: 'Quantity', align: 'left' },
  { id: 'inStock', label: 'In Stock', align: 'left' },
  { id: 'brand', label: 'Brand', align: 'left' },
  { id: 'created', label: 'Date created', align: 'left' },
  { id: '' }
];

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm
}));

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

export default function CategoryList() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { product, bulkProduct, auth } = useSelector((state) => state);
  const { bulkProducts } = bulkProduct;
  const { products } = product;
  const { token } = auth;
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const pages = new Array(products.numberOfPages).fill(null).map((v, i) => i);
  const gotoPrevious = () => {
    setPage(Math.max(0, page - 1));
  };

  const gotoNext = () => {
    setPage(Math.min(products.numberOfPages - 1, page + 1));
  };

  const handleDeleteProduct = async (slug) => {
    const reqObject = {
      slug,
      accessToken: token
    };
    const reduxRes = await dispatch(deleteProduct(reqObject));
    if (reduxRes.type === 'product/delete/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    } else if (reduxRes.type === 'product/delete/fulfilled') {
      enqueueSnackbar(`Product Deleted!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      dispatch(getProducts({ page }));
    }
  };

  useEffect(() => {
    const reqObject = {
      page,
      accessToken: token
    };
    dispatch(getProducts(reqObject));
  }, [dispatch, page, token]);

  // BULK Category creation
  const handleBulkAdd = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file.type === 'text/csv') {
      const text = await file.text();
      const result = csvparse(text, {
        header: true,
        keepEmptyRows: false,
        skipEmptyLines: true
      });
      const bulkData = result.data.map((res) => ({
        ...res,
        id: uuidv4()
      }));
      dispatch(loadBulkProducts(bulkData));
    }
  };

  const handleBulkRemove = (v) => {
    dispatch(removeBulkProducts(v));
  };

  const handleBulkProductUpload = async (products) => {
    setLoading(true);
    const reqObject = {
      products,
      accessToken: token
    };
    const reduxRes = await dispatch(createBulkProduct(reqObject));
    if (reduxRes.type === 'product/create-bulk/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'product/create-bulk/fulfilled') {
      enqueueSnackbar(`Products Created!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
      dispatch(removeBulkProducts([]));
      dispatch(getProducts({ page }));
    }
  };

  const handleDeleteMany = async (ids) => {
    setLoading(true);
    const reqObject = {
      ids,
      accessToken: token
    };
    const reduxRes = await dispatch(deleteManyProducts(reqObject));
    if (reduxRes.type === 'product/delete-many/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'product/delete-many/fulfilled') {
      enqueueSnackbar(`Products Deleted!`, {
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

  if (products?.data.length) {
    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelecteds = products.data.map((n) => n._id);
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

    const filtredProducts = applySortFilter(products.data, getComparator(order, orderBy), filterName);

    const isProductNotFound = filtredProducts.length === 0;

    content = (
      <Card>
        <ProductListToolbar
          handleDeleteMany={handleDeleteMany}
          loading={loading}
          selected={selected}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <ProductListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={products.data.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filtredProducts.map((row) => {
                  const { _id, name, slug, category, salePrice, quantity, brand, images, createdAt } = row;

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
                          <ThumbImgStyle alt={name} src={images[0]} />
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{category?.name}</TableCell>
                      <TableCell>{fCurrency(salePrice)}</TableCell>
                      <TableCell>{quantity}</TableCell>

                      <TableCell style={{ minWidth: 160 }}>
                        <Label
                          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                          color={
                            (product.quantity <= 0 && 'error') || (product.quantity <= 10 && 'warning') || 'success'
                          }
                        >
                          {product.quantity >= 10 && sentenceCase('In Stock')}
                          {product.quantity < 10 && product.quantity > 0 && sentenceCase('Low In Stock')}
                          {product.quantity <= 0 && sentenceCase('Out of Stock')}
                        </Label>
                      </TableCell>
                      <TableCell>{brand}</TableCell>
                      <TableCell>{createdAt.split('T')[0]}</TableCell>

                      <TableCell align="right">
                        <ProductMoreMenu onDelete={() => handleDeleteProduct(slug)} _id={_id} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              {isProductNotFound && (
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
        {products.data.length > 0 && (
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
  } else if (product.isLoading) {
    content = (
      <Card sx={{ padding: '10%' }}>
        <LoadingScreen />
      </Card>
    );
  } else {
    content = (
      <Card>
        <Typography>Error</Typography>
      </Card>
    );
  }

  return (
    <Page title="Product List | iDan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Product List"
          links={[{ name: 'Dashboard', href: PATH_ADMIN.directories.products }, { name: 'Product List' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_ADMIN.forms.newProduct}
              startIcon={<Icon icon={plusFill} />}
            >
              New Product
            </Button>
          }
        />

        <Grid container>
          <Grid item xs={12}>
            {content}
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ padding: '2%' }}>
              <BulkProductAdd
                products={bulkProducts}
                handleBulkAdd={handleBulkAdd}
                setBulkProducts={handleBulkRemove}
                loading={loading}
                handleBulkProductUpload={handleBulkProductUpload}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
