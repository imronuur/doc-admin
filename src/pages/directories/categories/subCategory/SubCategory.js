import { filter } from 'lodash';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';

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
import LoadingScreen from '../../../../components/LoadingScreen';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { getSubCategories } from '../../../../redux/slices/subCategories';
import { deleteSubCategory, deleteManySubCategories } from '../../../../redux/thunk/subCategoryThunk';

// hooks
import useSettings from '../../../../hooks/useSettings';
// components
import Scrollbar from '../../../../components/Scrollbar';
import SearchNotFound from '../../../../components/SearchNotFound';
import { MIconButton } from '../../../../components/@material-extend';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { PATH_ADMIN } from '../../../../routes/paths';
import { SubCategoryListHead, SubCategoryListToolbar, SubCategoryMoreMenu } from './components';
// ----------------------------------------------------------------------

let content = null;

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'parentCategory', label: 'Parent Category', align: 'left' },
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
  const { subCategory, auth } = useSelector((state) => state);
  const { subCategories } = subCategory;
  const { token } = auth;
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const pages = new Array(subCategories.numberOfPages).fill(null).map((v, i) => i);
  const gotoPrevious = () => {
    setPage(Math.max(0, page - 1));
  };

  const gotoNext = () => {
    setPage(Math.min(subCategories.numberOfPages - 1, page + 1));
  };

  const handleDeleteSubCategory = async (slug) => {
    const reqObject = {
      slug
    };
    const reduxRes = await dispatch(deleteSubCategory(reqObject));
    if (reduxRes.type === 'subCategory/delete/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    } else if (reduxRes.type === 'subCategory/delete/fulfilled') {
      enqueueSnackbar(`Sub Category Deleted!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      dispatch(getSubCategories({ page }));
    }
  };

  useEffect(() => {
    const reqObject = {
      page,
      authToken: token
    };
    dispatch(getSubCategories(reqObject));
  }, [dispatch, page]);

  const handleDeleteMany = async (ids) => {
    setLoading(true);
    const reqObject = {
      ids
    };
    const reduxRes = await dispatch(deleteManySubCategories(reqObject));
    if (reduxRes.type === 'subCategory/delete-many/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'subCategory/delete-many/fulfilled') {
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

  if (subCategories?.data.length) {
    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelecteds = subCategories.data.map((n) => n._id);
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

    const filtredSubCategories = applySortFilter(subCategories.data, getComparator(order, orderBy), filterName);

    const isCategoryNotFound = filtredSubCategories.length === 0;

    content = (
      <Card>
        <SubCategoryListToolbar
          handleDeleteMany={handleDeleteMany}
          loading={loading}
          selected={selected}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <SubCategoryListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={subCategories.data.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filtredSubCategories.map((row) => {
                  const { _id, name, slug, createdAt, parent } = row;

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
                      <TableCell>{parent?.name}</TableCell>
                      <TableCell>{createdAt.split('T')[0]}</TableCell>

                      <TableCell align="right">
                        <SubCategoryMoreMenu onDelete={() => handleDeleteSubCategory(slug)} _id={_id} />
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
        {subCategories.data.length > 0 && (
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
  } else if (subCategories.isLoading) {
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
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading="Sub Category List"
        links={[{ name: 'Dashboard', href: PATH_ADMIN.root }, { name: 'Category List' }]}
        action={
          <Button
            variant="contained"
            component={RouterLink}
            to={PATH_ADMIN.forms.newSubCategory}
            startIcon={<Icon icon={plusFill} />}
          >
            New Sub Category
          </Button>
        }
      />

      {content}
    </Container>
  );
}
