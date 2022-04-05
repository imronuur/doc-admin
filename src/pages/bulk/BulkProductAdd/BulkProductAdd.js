import * as React from 'react';
import PropTypes from 'prop-types';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
import { Table, TableHead, TableRow, TableCell, TableBody, Container, Typography, Button, Grid } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import useSettings from '../../../hooks/useSettings';

import { ProductBulkMore } from '../components';
import { loadBulkProducts } from '../../../redux/slices/bulkProducts';

let content = null;

BulkProductAdd.propTypes = {
  products: PropTypes.array,
  handleBulkAdd: PropTypes.func,
  setBulkProducts: PropTypes.func,
  handleBulkProductUpload: PropTypes.func,
  loading: PropTypes.bool
};

export default function BulkProductAdd({ products, handleBulkAdd, setBulkProducts, handleBulkProductUpload, loading }) {
  const { bulkProduct } = useSelector((state) => ({ ...state }));

  const { bulkProducts } = bulkProduct;
  const dispatch = useDispatch();
  const handleRemove = (id) => {
    dispatch(loadBulkProducts(bulkProducts.filter((v) => v.id !== id)));
  };
  const { themeStretch } = useSettings();

  if (products && products.length > 0) {
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
            {`Added ${products.length} products`}
          </Typography>
        </Grid>

        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Regular price</TableCell>
              <TableCell>Sale Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Brand</TableCell>
            </TableRow>
          </TableHead>
          {products
            .filter((res, index) => index < 10)
            .map((product, index) => (
              <TableBody key={index}>
                <TableRow>
                  <TableCell align="left">{product.name}</TableCell>
                  <TableCell align="left">{product.description}</TableCell>
                  <TableCell align="left">{product.regularPrice}</TableCell>
                  <TableCell align="left">{product.salePrice}</TableCell>
                  <TableCell align="left">{product.quantity}</TableCell>
                  <TableCell align="left">{product.size}</TableCell>
                  <TableCell align="left">{product.brand}</TableCell>

                  <TableCell align="right">
                    <ProductBulkMore id={product.id} onDelete={() => handleRemove(product.id)} />
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          {products.length > 10 && (
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
          onClick={() => handleBulkProductUpload(products)}
          disabled={loading}
        >
          Upload Products
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{
            marginBottom: '1%',
            marginLeft: '1%'
          }}
          onClick={() => setBulkProducts([])}
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
            No Bulk Added Products
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
            Add Products
          </Button>
        </Grid>
      </Grid>
    );
  }
  return <Container maxWidth={themeStretch ? false : 'lg'}>{content}</Container>;
}
