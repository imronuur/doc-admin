import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  Stack,
  Button,
  Divider,
  Checkbox,
  TextField,
  DialogTitle,
  DialogActions,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
//
import { v4 as uuidv4 } from 'uuid';
import { DialogAnimate } from '../../../../../components/animate';

// ----------------------------------------------------------------------

CheckoutNewAddressForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onNextStep: PropTypes.func,
  onCreateBilling: PropTypes.func
};

export default function CheckoutNewAddressForm({ open, onClose, onNextStep, onCreateBilling }) {
  const NewAddressSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),

    phone: Yup.string().required('Phone is required'),
    email: Yup.string().email().required('Email is required'),
    //  city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    company: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      _id: uuidv4(),
      name: '',
      phone: '',
      email: '',
      state: '',
      company: '',

      isDefault: true
    },
    validationSchema: NewAddressSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        onNextStep();
        setSubmitting(true);
        onCreateBilling({
          name: values.name,
          phone: values.phone,
          email: values.email,
          fullAddress: `${values.state}`,
          addressType: 'Home',
          isDefault: values.isDefault
        });
      } catch (error) {
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <DialogAnimate maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Add new address</DialogTitle>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={{ xs: 2, sm: 3 }} sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Full Name"
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
              <TextField
                fullWidth
                label="Phone Number"
                {...getFieldProps('phone')}
                error={Boolean(touched.phone && errors.phone)}
                helperText={touched.phone && errors.phone}
              />
            </Stack>

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="State"
                {...getFieldProps('state')}
                error={Boolean(touched.state && errors.state)}
                helperText={touched.state && errors.state}
              />
            </Stack>

            <TextField
              fullWidth
              label="Company"
              {...getFieldProps('company')}
              //   SelectProps={{ native: true }}
              error={Boolean(touched.company && errors.company)}
              helperText={touched.company && errors.company}
            >
              {/* {countries.map((option) => (
                <option key={option.code} value={option.label}>
                  {option.label}
                </option>
              ))} */}
            </TextField>

            <FormControlLabel
              control={<Checkbox checked={values.isDefault} {...getFieldProps('isDefault')} />}
              label="Use this address as default."
              sx={{ mt: 3 }}
            />
          </Stack>

          <Divider />

          <DialogActions>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Deliver to this Address
            </LoadingButton>
            <Button type="button" color="inherit" variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </DialogAnimate>
  );
}
