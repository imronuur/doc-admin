import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { Card, Grid, TextField, Typography, Box, FormHelperText, Button } from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UploadAvatar } from '../../../../components/upload';
import { storage, deleteFirebaseObject, refFirebase } from '../../../../Firebase';
import { fData } from '../../../../utils/formatNumber';
//
// routes
//

import { Validations } from './Validations';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));
// ----------------------------------------------------------------------

CategoryNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCategory: PropTypes.object,
  handleCategoryCreate: PropTypes.func,
  loading: PropTypes.bool
};

export default function CategoryNewForm({ isEdit, currentCategory, handleCategoryCreate, loading }) {
  const [fileLoading, setFileLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentCategory?.name || '',
      slug: currentCategory?.slug || '',
      image: currentCategory?.image || ''
    },
    validationSchema: Validations,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        handleCategoryCreate(values);
        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, touched, handleSubmit, getFieldProps, values, setFieldValue } = formik;

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const fileRef = refFirebase(storage, file.name);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);

      if (fileUrl) {
        setFieldValue('image', fileUrl);
      }
    },
    [setFieldValue]
  );

  const handleRemove = async (fileName) => {
    const desertRef = refFirebase(storage, fileName);
    await deleteFirebaseObject(desertRef);
    setFieldValue('image', '');
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category Name"
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
                <UploadAvatar
                  accept="image/*"
                  file={values.image}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.image && errors.image)}
                  caption={
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: 'auto',
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.secondary'
                        }}
                      >
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br /> max size of {fData(3145728)}
                      </Typography>
                      {values.image && (
                        <Button color="error" onClick={() => handleRemove(values.image)}>
                          {' '}
                          Remove{' '}
                        </Button>
                      )}
                    </Box>
                  }
                />

                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.image && errors.image}
                </FormHelperText>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={loading}>
                {!isEdit ? 'Create Category' : 'Save Changes'}
              </LoadingButton>
            </Grid>
          </Grid>
        </Card>
      </Form>
    </FormikProvider>
  );
}
