import * as yup from 'yup';

export const Validations = yup.object().shape({
  title: yup.string().required('Title is required'),
  subTitle: yup.string().required('Sub Title is required'),
  expiryDate: yup.date().required('Expiry Date is required'),
  price: yup.number().required('Price is required')
});
