import * as yup from 'yup';

export const Validations = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  images: yup.array().required('Images are required'),
  regularPrice: yup.string().required('Price is required'),
  salePrice: yup.string(),
  subCategories: yup.array().required('Sub Categories are required'),
  quantity: yup.number().required('Quantity is required'),
  inStock: yup.bool(),
  shipping: yup.bool(),
  brand: yup.string().required('Brand is required'),
  size: yup.string().required('Size is required'),
  sold: yup.string(),
  category: yup.string().required('Category is required')
});
