import * as yup from 'yup';

export const Validations = yup.object().shape({
  name: yup.string().required('Full Name is required'),
  email: yup.string().required('Email Address is required'),
  state: yup.string().required('State is required'),
  phone: yup.string().required('Phone Number is required')
});
