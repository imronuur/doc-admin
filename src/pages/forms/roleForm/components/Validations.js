import * as yup from 'yup';

export const Validations = yup.object().shape({
  name: yup.string().required('Name is required'),
  permissions: yup.array().required('Description is required')
});
