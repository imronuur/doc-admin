import * as yup from 'yup';

export const Validations = yup.object().shape({
  title: yup.string().required('Title is required'),

  subTitle: yup.string().required('Sub Title is required'),
  product: yup.string().required('Product is required')
});
