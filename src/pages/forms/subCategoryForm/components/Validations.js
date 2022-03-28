import * as yup from 'yup';

export const Validations = yup.object().shape({
  name: yup.string().required('Name is required'),
  parent: yup.string().required('Parent is required')
});
