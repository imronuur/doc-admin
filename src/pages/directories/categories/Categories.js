import { filter } from 'lodash';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { parse as csvparse } from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
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
import { loadBulkCategories, removeBulkCategories } from '../../../redux/slices/bulkCategories';
import { deleteCategory, createBulkCategory, deleteManyCategories } from '../../../redux/thunk/categoryThunk';

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

import { CategoryListHead, CategoryListToolbar, CategoryMoreMenu } from './components';
import { BulkCategoryAdd } from '../../bulk/BulkCategoryAdd';
import SubCategory from './subCategory/SubCategory';

// ----------------------------------------------------------------------

let content = null;

const TABLE_HEAD = [
  { id: 'name', label: 'Category Name', align: 'left' },
  { id: 'dateCreated', label: 'Date Created', align: 'left' },
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
  const { category, bulkCategory, auth } = useSelector((state) => state);
  const { bulkCategories } = bulkCategory;
  const { categories } = category;
  const { token } = auth;
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const pages = new Array(categories.numberOfPages).fill(null).map((v, i) => i);
  const gotoPrevious = () => {
    setPage(Math.max(0, page - 1));
  };

  const gotoNext = () => {
    setPage(Math.min(categories.numberOfPages - 1, page + 1));
  };

  const handleDeleteCategory = async (slug) => {
    const reqObject = {
      slug
    };
    const reduxRes = await dispatch(deleteCategory(reqObject));
    if (reduxRes.type === 'category/delete/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    } else if (reduxRes.type === 'category/delete/fulfilled') {
      enqueueSnackbar(`Category Deleted!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      dispatch(getCategories({ page }));
    }
  };

  useEffect(() => {
    const reqObject = {
      page,
      authToken: token
    };
    dispatch(getCategories(reqObject));
  }, [dispatch, page]);

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
      dispatch(loadBulkCategories(bulkData));
    }
  };

  const handleBulkRemove = (v) => {
    dispatch(removeBulkCategories(v));
  };

  const handleBulkCategoryUpload = async (names) => {
    setLoading(true);
    const reqObject = {
      names
    };
    const reduxRes = await dispatch(createBulkCategory(reqObject));
    if (reduxRes.type === 'category/create-bulk/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'category/create-bulk/fulfilled') {
      enqueueSnackbar(`Categories Created!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
      dispatch(removeBulkCategories([]));
      dispatch(getCategories({ page }));
    }
  };

  const handleDeleteMany = async (ids) => {
    setLoading(true);
    const reqObject = {
      ids
    };
    const reduxRes = await dispatch(deleteManyCategories(reqObject));
    if (reduxRes.type === 'category/delete-many/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'category/delete-many/fulfilled') {
      enqueueSnackbar(`Categories Deleted!`, {
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

  if (categories?.data.length) {
    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelecteds = categories.data.map((n) => n._id);
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

    const filtredCategories = applySortFilter(categories.data, getComparator(order, orderBy), filterName);

    const isCategoryNotFound = filtredCategories.length === 0;

    content = (
      <Card>
        <CategoryListToolbar
          handleDeleteMany={handleDeleteMany}
          loading={loading}
          selected={selected}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <CategoryListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={categories.data.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filtredCategories.map((row) => {
                  const { _id, name, slug, createdAt } = row;

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
                      <TableCell>{createdAt.split('T')[0]}</TableCell>

                      <TableCell align="right">
                        <CategoryMoreMenu onDelete={() => handleDeleteCategory(slug)} _id={_id} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              {isCategoryNotFound && (
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
        {categories.data.length > 0 && (
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
  } else if (category.isLoading) {
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
    <Page title="Ecommerce: Category List | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Category List"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Category List' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_ADMIN.forms.newCategory}
              startIcon={<Icon icon={plusFill} />}
            >
              New Category
            </Button>
          }
        />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {content}
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ padding: '2%' }}>
              <BulkCategoryAdd
                categories={bulkCategories}
                handleBulkAdd={handleBulkAdd}
                setBulkCategories={handleBulkRemove}
                loading={loading}
                handleBulkCategoryUpload={handleBulkCategoryUpload}
              />
            </Card>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: '2%' }}>
            <SubCategory />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
