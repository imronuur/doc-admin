import * as yup from 'yup';

export const Validations = yup.object().shape({
  name: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email').required('Email Address is required'),
  state: yup.string().required('State is required'),
  phone: yup
    .number()
    .typeError("That doesn't look like a phone number")
    .positive("A phone number can't start with a minus")
    .integer("A phone number can't include a decimal point")
    .min(8)
    .required('Phone Number is required')
});
