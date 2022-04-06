import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
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
  InputLabel,
  Typography,
  FormControl,
  Autocomplete,
  InputAdornment,
  FormHelperText,
  FormControlLabel,
  MenuItem,
  FormLabel
} from '@mui/material';
import { QuillEditor } from '../../../../components/editor';
import { UploadMultiFile } from '../../../../components/upload';

import { storage } from '../../../../Firebase';

import { Validations } from './Validations';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

UsersForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
  handleCreate: PropTypes.func,
  loading: PropTypes.bool,
  categories: PropTypes.array,
  subCategories: PropTypes.array
};

export default function UsersForm({ isEdit, currentUser, handleCreate, loading }) {
  const [fileLoading, setFileLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentUser?.fullname || '',
      state: currentUser?.state || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      company: currentUser?.company || '' //
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

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFileLoading(true);
      const newImages = [...values.images];
      acceptedFiles.map(async (file) => {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(file.name);
        await fileRef.put(file);
        const fileUrl = await fileRef.getDownloadURL();
        newImages.push(fileUrl);
        setFieldValue('images', newImages);
      });
      setFileLoading(false);
    },
    [setFieldValue]
  );

  const handleRemoveAll = (files) => {
    setFileLoading(true);
    files.map(async (file) => storage.refFromURL(file).delete());
    setFieldValue('images', []);
    setFileLoading(false);
  };

  const handleRemove = async (file) => {
    setFileLoading(true);
    await storage.refFromURL(file).delete();
    const filteredItems = values.images.filter((_file) => _file !== file);
    setFieldValue('images', filteredItems);
    setFileLoading(false);
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Full Name"
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  type="email"
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  {...getFieldProps('phone')}
                  error={Boolean(touched.phone && errors.phone)}
                  helperText={touched.phone && errors.phone}
                  type="tel"
                />
                <TextField
                  fullWidth
                  label="State"
                  {...getFieldProps('state')}
                  error={Boolean(touched.state && errors.state)}
                  helperText={touched.state && errors.state}
                />
                <TextField fullWidth label="Company" {...getFieldProps('company')} />
              </Stack>
              <Grid item xs={12} mt={2} my={2}>
                <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={loading}>
                  {!isEdit ? 'Create User' : 'Save Changes'}
                </LoadingButton>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
