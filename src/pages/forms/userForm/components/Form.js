import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { Form, FormikProvider, useFormik, FieldArray, getIn } from 'formik';
import { Icon } from '@iconify/react';

import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';

// material
import {
  Box,
  Grid,
  Card,
  Stack,
  TextField,
  Typography,
  FormHelperText,
  Select,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  CardHeader,
  Button,
  IconButton,
  InputAdornment
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { getDownloadURL } from 'firebase/storage';

import { UploadAvatar } from '../../../../components/upload';
// utils
import { fData } from '../../../../utils/formatNumber';
//

import { Validations } from './Validations';
import { useFirebaseAuth } from '../../../../contexts/authContext';
import { storage, deleteFirebaseObject, refFirebase } from '../../../../Firebase';

// ----------------------------------------------------------------------

UserForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  handleCreate: PropTypes.func,
  loading: PropTypes.bool,
  roles: PropTypes.array
};

export default function UserForm({ isEdit, currentUser, loading, handleCreate, roles }) {
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useFirebaseAuth();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentUser?.name || 'Dave',
      email: currentUser?.email || 'dave@silicon.so',
      photo: currentUser?.photo || '',
      password: '',
      phone: currentUser?.phone || '252618882000',
      address: currentUser?.address || [{ address1: 'Kaxda', state: 'Banaadir', city: 'Mogadishu' }],
      role: currentUser?.role || '',
      dob: currentUser?.dob || '1990-01-01',
      gender: currentUser?.gender || '',
      company: currentUser?.company || '',
      _id: currentUser?._id,

      // eslint-disable-next-line no-unneeded-ternary
      showPassword: isEdit ? false : true
    },

    validationSchema: Validations,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        // eslint-disable-next-line prettier/prettier
        if (!isEdit) {
          const { accessToken } = await register(values.email, values.password);
          if (accessToken) handleCreate(values);
        } else {
          handleCreate(values);
        }
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { values, errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const fileRef = refFirebase(storage, file.name);
      const fileUrl = await getDownloadURL(fileRef);

      if (fileUrl) {
        setFieldValue('photo', fileUrl);
      }
    },
    [setFieldValue]
  );

  const handleRemove = async (fileName) => {
    const desertRef = refFirebase(storage, fileName);
    await deleteFirebaseObject(desertRef);
    setFieldValue('photo', '');
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
              <UploadAvatar
                accept="image/*"
                file={values.photo}
                maxSize={3145728}
                onDrop={handleDrop}
                error={Boolean(touched.photo && errors.photo)}
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
                    {values.photo && <Button onClick={() => handleRemove(values.photo)}> Remove </Button>}
                  </Box>
                }
              />

              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {touched.photo && errors.photo}
              </FormHelperText>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={{ xs: 2, md: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormLabel>Name</FormLabel>
                    <TextField
                      fullWidth
                      {...getFieldProps('name')}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormLabel>Email</FormLabel>
                    <TextField
                      fullWidth
                      {...getFieldProps('email')}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  {!isEdit && (
                    <Grid item xs={12} md={6}>
                      <FormLabel>Password</FormLabel>
                      <TextField
                        fullWidth
                        required
                        autoComplete="current-password"
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        {...getFieldProps('password')}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                                <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} md={6}>
                    <FormLabel>Phone Number</FormLabel>
                    <TextField
                      fullWidth
                      {...getFieldProps('phone')}
                      error={Boolean(touched.phone && errors.phone)}
                      helperText={touched.phone && errors.phone}
                    />
                  </Grid>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Grid item xs={12}>
                    <FieldArray
                      name="address"
                      render={(arrayHelpers) => (
                        <>
                          {arrayHelpers.form.values.address && arrayHelpers.form.values.address.length >= 0 ? (
                            <>
                              {arrayHelpers.form.values.address.map((res, index) => (
                                <div key={index}>
                                  <CardHeader title="Address" sx={{ p: 1, color: 'text.disabled' }} />
                                  <Stack spacing={3}>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                                      <Grid item xs={12} md={4}>
                                        <TextField
                                          fullWidth
                                          label="Address Name"
                                          {...getFieldProps(`address.${index}.address1`)}
                                          error={Boolean(getIn(errors, `address.${index}.address1`))}
                                          helperText={getIn(errors, `address.${index}.address1`)}
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={4}>
                                        <TextField
                                          fullWidth
                                          label="City"
                                          {...getFieldProps(`address.${index}.city`)}
                                          error={Boolean(getIn(errors, `address.${index}.city`))}
                                          helperText={getIn(errors, `address.${index}.city`)}
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={4}>
                                        <TextField
                                          fullWidth
                                          label="State"
                                          {...getFieldProps(`address.${index}.state`)}
                                          error={Boolean(getIn(errors, `address.${index}.state`))}
                                          helperText={getIn(errors, `address.${index}.state`)}
                                        />
                                      </Grid>
                                    </Stack>
                                  </Stack>
                                  <Grid item xs={6}>
                                    <Button
                                      variant="outlined"
                                      disabled={arrayHelpers.form.values.address.length === 1}
                                      color="error"
                                      onClick={() => arrayHelpers.remove(index)}
                                      sx={{ mt: 1, ml: 1 }}
                                    >
                                      Remove
                                    </Button>
                                  </Grid>
                                </div>
                              ))}
                              <Grid item xs={12}>
                                <Button
                                  type="button"
                                  variant="text"
                                  onClick={() =>
                                    arrayHelpers.push({
                                      address1: '',
                                      city: '',
                                      state: ''
                                    })
                                  }
                                  sx={{ mt: 3, ml: 1 }}
                                >
                                  + Add Address
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
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormLabel> Date Of Birth </FormLabel>
                    <TextField
                      fullWidth
                      {...getFieldProps('dob')}
                      error={Boolean(touched.dob && errors.dob)}
                      helperText={touched.dob && errors.dob}
                      type="date"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormLabel>Select Role</FormLabel>
                    <Select fullWidth {...getFieldProps('role')}>
                      {roles.map((option) => (
                        <MenuItem key={option._id} value={option.name}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText error sx={{ m: '1%' }}>
                      {touched.role && errors.role}
                    </FormHelperText>
                  </Grid>
                </Stack>
                <Stack direction={{ xs: 'row' }} spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormLabel> Company </FormLabel>
                    <TextField fullWidth {...getFieldProps('company')} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormLabel> Choose Gender </FormLabel>

                    <RadioGroup
                      aria-labelledby="demo-radio-butto ns-group-label"
                      defaultValue="male"
                      {...getFieldProps('gender')}
                    >
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                    </RadioGroup>
                    <FormHelperText error sx={{ m: '1%' }}>
                      {touched.gender && errors.gender}
                    </FormHelperText>
                  </Grid>
                </Stack>
              </Stack>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={loading}>
                  {!isEdit ? 'Create User' : 'Save Changes'}
                </LoadingButton>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
