import * as yup from 'yup';

export const Validations = yup.object().shape({
  name: yup.string().required('Name is required'),
  image: yup.string().required('Image is required')
});
