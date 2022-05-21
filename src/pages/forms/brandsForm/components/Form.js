import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';

import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { Card, Grid, Stack, TextField, Box, Typography, Button } from '@mui/material';
import UploadAvatar from './UploadAvatar';
import { storage, deleteFirebaseObject } from '../../../../Firebase';
import { Validations } from './Validations';
import { fData } from '../../../../utils/formatNumber';

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

  const handleRemove = async (fileName) => {
    const desertRef = ref(storage, fileName);
    await deleteFirebaseObject(desertRef);
    setFieldValue('logo', '');
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
                    error={Boolean(touched.logo && errors.logo)}
                    fileLoading={fileLoading}
                    caption={
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                        gap={2}
                      >
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
                        {values.logo && <Button onClick={() => handleRemove(values.logo)}> Remove </Button>}
                      </Box>
                    }
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
