import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik, FieldArray, getIn } from 'formik';
// material
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Chip,
  Grid,
  Stack,
  Switch,
  Select,
  TextField,
  Button,
  Typography,
  CardHeader,
  Autocomplete,
  InputAdornment,
  FormHelperText,
  FormControlLabel,
  MenuItem,
  FormLabel
} from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { QuillEditor } from '../../../../components/editor';
import { UploadMultiFile } from '../../../../components/upload';
import { storage, deleteFirebaseObject, refFirebase } from '../../../../Firebase';
import { Validations } from './Validations';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

CategoryNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
  handleCreate: PropTypes.func,
  loading: PropTypes.bool,
  categories: PropTypes.array,
  subCategories: PropTypes.array
};

export default function CategoryNewForm({ isEdit, currentProduct, handleCreate, loading, categories, subCategories }) {
  const [fileLoading, setFileLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentProduct?.name || 'Samsung s21 ultra',
      description: currentProduct?.description || 'This is the newset Samsung product',
      images: currentProduct?.images || [], //
      regularPrice: currentProduct?.regularPrice || '3000',
      salePrice: currentProduct?.salePrice || '2500',
      quantity: currentProduct?.quantity || '30', //
      subCategories: currentProduct?.subCategories.map((res) => res._id) || [],
      inStock: currentProduct?.inStock || true, //
      shipping: currentProduct?.shipping || true, //
      brand: currentProduct?.brand || 'Samsung', //
      size: currentProduct?.size || [], //
      sold: currentProduct?.sold || '2', //
      category: currentProduct?.category?._id || '',
      slug: currentProduct?.slug || ''
    },
    validationSchema: Validations,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        handleCreate(values);
        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFileLoading(true);
      const newImages = [...values.images];
      acceptedFiles.map(async (file) => {
        // const storageRef = ;
        const fileRef = ref(storage, file.name);
        await uploadBytes(fileRef, file);
        const fileUrl = await getDownloadURL(fileRef);
        newImages.push(fileUrl);
        setFieldValue('images', newImages);
      });
      setFileLoading(false);
    },
    [setFieldValue]
  );

  const handleRemoveAll = (files) => {
    setFileLoading(true);
    files.map(async (file) => {
      const delRef = await refFirebase(storage, file);
      deleteFirebaseObject(delRef);
    });
    setFieldValue('images', []);
    setFileLoading(false);
  };

  const handleRemove = async (file) => {
    setFileLoading(true);
    const delRef = await refFirebase(storage, file);
    await deleteFirebaseObject(delRef);
    const filteredItems = values.images.filter((_file) => _file !== file);
    setFieldValue('images', filteredItems);
    setFileLoading(false);
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Product Name"
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />

                <div>
                  <LabelStyle> Description </LabelStyle>
                  <QuillEditor
                    simple
                    id="product-description"
                    value={values.description}
                    onChange={(val) => setFieldValue('description', val)}
                    error={Boolean(touched.description && errors.description)}
                  />
                  {touched.description && errors.description && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {touched.description && errors.description}
                    </FormHelperText>
                  )}
                </div>

                <div>
                  <LabelStyle>Add Images</LabelStyle>
                  <UploadMultiFile
                    showPreview
                    maxSize={3145728}
                    accept="image/*"
                    files={values.images}
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                    onRemoveAll={() => handleRemoveAll(values.images)}
                    error={Boolean(touched.images && errors.images)}
                    fileLoading={fileLoading}
                  />
                  {touched.images && errors.images && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {touched.images && errors.images}
                    </FormHelperText>
                  )}
                </div>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <FormControlLabel
                  control={<Switch {...getFieldProps('inStock')} checked={values.inStock} />}
                  label="In stock"
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={<Switch {...getFieldProps('shipping')} checked={values.shipping} />}
                  label="Shipping"
                  sx={{ mb: 2 }}
                />

                <Stack spacing={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Brand"
                        {...getFieldProps('brand')}
                        error={Boolean(touched.brand && errors.brand)}
                        helperText={touched.brand && errors.brand}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FieldArray
                        name="size"
                        render={(arrayHelpers) => (
                          <>
                            {arrayHelpers.form.values.size && arrayHelpers.form.values.size.length >= 0 ? (
                              <>
                                {arrayHelpers.form.values.size.map((res, index) => (
                                  <Grid container>
                                    <TextField
                                      fullWidth
                                      label="Size"
                                      {...getFieldProps(`size.${index}`)}
                                      error={Boolean(touched.size && errors.size)}
                                      helperText={touched.size && errors.size}
                                    />

                                    <Grid item xs={2} sx={{ marginBottom: '3%' }}>
                                      <Button
                                        variant="contained"
                                        disabled={arrayHelpers.form.values.size.length === 1}
                                        color="secondary"
                                        onClick={() => arrayHelpers.remove(index)}
                                        sx={{ mt: 3, ml: 1 }}
                                      >
                                        Remove
                                      </Button>
                                    </Grid>
                                  </Grid>
                                ))}
                                <Grid item xs={12}>
                                  <Button
                                    type="button"
                                    variant="text"
                                    onClick={() => arrayHelpers.push()}
                                    sx={{ mt: 3, ml: 1 }}
                                  >
                                    + Add Size
                                  </Button>
                                </Grid>
                              </>
                            ) : (
                              <Typography> Nothing</Typography>
                            )}
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        placeholder="only numbers"
                        label="Quantity"
                        type="number"
                        {...getFieldProps('quantity')}
                        error={Boolean(touched.quantity && errors.quantity)}
                        helperText={touched.quantity && errors.quantity}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        placeholder="only numbers"
                        label="Sold"
                        type="number"
                        {...getFieldProps('sold')}
                        error={Boolean(touched.sold && errors.sold)}
                        helperText={touched.sold && errors.sold}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormLabel>Select A Parent Category</FormLabel>
                      <Select fullWidth {...getFieldProps('category')}>
                        {categories.map((option) => (
                          <MenuItem key={option._id} value={option._id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error sx={{ m: '1%' }}>
                        {touched.category && errors.category}
                      </FormHelperText>
                    </Grid>
                  </Grid>
                  {values.category && (
                    <Autocomplete
                      multiple
                      onChange={(event, newValue) => {
                        setFieldValue('subCategories', newValue);
                      }}
                      options={subCategories.filter((option) => option.parent === values.category)}
                      getOptionLabel={(option) => option.name}
                      filterSelectedOptions
                      renderInput={(params) => <TextField {...params} label="Sub Categories" />}
                    />
                  )}
                </Stack>
              </Card>

              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    placeholder="0.00"
                    label="Regular Price"
                    {...getFieldProps('regularPrice')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      type: 'number'
                    }}
                    error={Boolean(touched.regularPrice && errors.regularPrice)}
                    helperText={touched.regularPrice && errors.regularPrice}
                  />

                  <TextField
                    fullWidth
                    placeholder="0.00"
                    label="Sale Price"
                    {...getFieldProps('salePrice')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      type: 'number'
                    }}
                  />
                </Stack>
              </Card>

              <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={loading}>
                {!isEdit ? 'Create Product' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
