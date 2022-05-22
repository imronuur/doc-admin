import * as yup from 'yup';

export const Validations = yup.object().shape({
  name: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email').required('Email Address is required'),
  showPassword: yup.boolean(),
  password: yup.string().when('showPassword', {
    is: true,
    then: yup.string().required('Password is Required')
  }),
  address: yup
    .array()
    .of(
      yup.object().shape({
        address1: yup.string().min(4, 'too short').required('First Address is required'),
        city: yup.string().required('City is required'),
        state: yup.string().required('State is required')
      })
    )
    .required('User must have Address')
    .max(3, 'Limit'),
  dob: yup.string().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  role: yup.string().required('Role is required'),
  phone: yup
    .number()
    .typeError("That doesn't look like a phone number")
    .positive("A phone number can't start with a minus")
    .integer("A phone number can't include a decimal point")
    .min(8)
    .required('Phone Number is required')
});
