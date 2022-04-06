import * as yup from 'yup';

export const Validations = yup.object().shape({
  name: yup.string().required('Coupon Name is required'),
  expiryDate: yup.string().required('Expiry Date is required'),
  discount: yup.string().required('Discount Rate is required')
});
