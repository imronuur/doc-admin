import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import roundClose from '@iconify/icons-ic/round-close';
// material
import { Stack, TextField, IconButton, InputAdornment, Alert, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import { createOrUpdateUser } from '../../../redux/thunk/authThunk';
import { useDispatch } from '../../../redux/store';
// import useIsMountedRef from '../../../hooks/useIsMountedRef';
//
import { useFirebaseAuth } from '../../../contexts/authContext';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const { register } = useFirebaseAuth();
  // const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      try {
        const name = values.firstName.concat(values.lastName);
        const { accessToken } = await register(values.email, values.password);

        const reqObject = {
          accessToken,
          name
        };

        const reduxRes = await dispatch(createOrUpdateUser(reqObject));

        if (reduxRes.type === 'auth/createOrUpdateuser/fulfilled') {
          enqueueSnackbar(`Registred Successfuly!`, {
            variant: 'success',
            action: (key) => (
              <Button size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={roundClose} />
              </Button>
            )
          });
        }
      } catch (error) {
        enqueueSnackbar(`${error.message}`, {
          variant: 'error',
          action: (key) => (
            <Button size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={roundClose} />
            </Button>
          )
        });
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
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

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
