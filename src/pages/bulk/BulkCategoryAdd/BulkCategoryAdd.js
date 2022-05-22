import * as React from 'react';
import PropTypes from 'prop-types';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
import { Table, TableHead, TableRow, TableCell, TableBody, Container, Typography, Button, Grid } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import useSettings from '../../../hooks/useSettings';

import { CategoryBulkMore } from '../components';
import { loadBulkCategories } from '../../../redux/slices/bulkCategories';

let content = null;

BulkCategoryAdd.propTypes = {
  categories: PropTypes.array,
  handleBulkAdd: PropTypes.func,
  setBulkCategories: PropTypes.func,
  loading: PropTypes.bool,
  handleBulkCategoryUpload: PropTypes.func
};

export default function BulkCategoryAdd({
  categories,
  handleBulkAdd,
  setBulkCategories,
  handleBulkCategoryUpload,
  loading
}) {
  const { bulkCategory } = useSelector((state) => ({ ...state }));

  const { bulkCategories } = bulkCategory;
  const dispatch = useDispatch();
  const handleRemove = (id) => {
    dispatch(loadBulkCategories(bulkCategories.filter((v) => v.id !== id)));
  };
  const { themeStretch } = useSettings();

  if (categories && categories.length > 0) {
    content = (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            sx={{
              fontSize: 30,
              alignItems: 'center',
              margin: 'auto'
            }}
            variant="h6"
          >
            {`Added ${categories.length} Categories`}
          </Typography>
        </Grid>

        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Category Name</TableCell>
            </TableRow>
          </TableHead>
          {categories
            .filter((res, index) => index < 10)
            .map((category, index) => (
              <TableBody key={index}>
                <TableRow>
                  <TableCell align="left">{category.name}</TableCell>

                  <TableCell align="right">
                    <CategoryBulkMore id={category.id} onDelete={() => handleRemove(category.id)} />
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          {categories.length > 10 && (
            <TableRow>
              <TableCell>And more...</TableCell>
            </TableRow>
          )}
        </Table>
        <Button
          variant="outlined"
          sx={{
            marginBottom: '1%',
            marginLeft: '1%'
          }}
          startIcon={<Icon icon={plusFill} />}
          onClick={() => handleBulkCategoryUpload(categories)}
          disabled={loading}
        >
          Upload Categories
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{
            marginBottom: '1%',
            marginLeft: '1%'
          }}
          onClick={() => setBulkCategories([])}
          disabled={loading}
          startIcon={<Icon icon={plusFill} />}
        >
          Remove
        </Button>
      </Grid>
    );
  } else {
    content = (
      <Grid containr spacing={2}>
        <Grid item xs={12}>
          <Typography
            sx={{
              fontSize: 30,
              alignItems: 'center',
              margin: 'auto'
            }}
            variant="h6"
          >
            No Bulk Added Categories
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            component="label"
            sx={{
              marginBottom: '1%',
              marginLeft: '1%'
            }}
            startIcon={<Icon icon={plusFill} />}
          >
            <input type="file" accept="text/csv" hidden onChange={(e) => handleBulkAdd(e)} />
            Add Categories
          </Button>
        </Grid>
      </Grid>
    );
  }
  return <Container maxWidth={themeStretch ? false : 'lg'}>{content}</Container>;
}
