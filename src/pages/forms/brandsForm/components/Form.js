import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { Card, Grid, Stack, TextField, Typography, FormHelperText } from '@mui/material';
import UploadAvatar from './UploadAvatar';
import { storage } from '../../../../Firebase';
import { Validations } from './Validations';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

OffersForm.propTypes = {
  isEdit: PropTypes.bool,
  currentBrand: PropTypes.object,
  handleCreate: PropTypes.func,
  loading: PropTypes.bool
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

export default function OffersForm({ isEdit, currentBrand, handleCreate, loading }) {
  const [fileLoading, setFileLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentBrand?.name || '',
      logo: currentBrand?.logo || '',
      _id: currentBrand?._id
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

  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  console.log(values);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFileLoading(true);
      let newLogo = values.logo;
      acceptedFiles.map(async (file) => {
        // const storageRef = ;
        const fileRef = ref(storage, file.name);
        await uploadBytes(fileRef, file);
        const fileUrl = await getDownloadURL(fileRef);
        newLogo = fileUrl;
        setFieldValue('logo', newLogo);
      });
      setFileLoading(false);
    },
    [setFieldValue]
  );

  const handleRemoveAll = (files) => {
    setFileLoading(true);
    files.map(async (file) => storage.refFromURL(file).delete());
    setFieldValue('logo', []);
    setFileLoading(false);
  };

  const handleRemove = async (file) => {
    setFileLoading(true);
    await storage.refFromURL(file).delete();
    const filteredItems = values.logo.filter((_file) => _file !== file);
    setFieldValue('logo', filteredItems);
    setFileLoading(false);
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Brand Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LabelStyle>Add Logo</LabelStyle>
                  <UploadAvatar
                    showPreview
                    maxSize={3145728}
                    accept="image/*"
                    file={values.logo}
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                    onRemoveAll={() => handleRemoveAll(values.logo)}
                    error={Boolean(touched.logo && errors.logo)}
                    fileLoading={fileLoading}
                  />
                </Grid>
              </Stack>
              <Grid item xs={12} mt={2} my={2}>
                <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={loading}>
                  {!isEdit ? 'Create Brand' : 'Save Changes'}
                </LoadingButton>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
