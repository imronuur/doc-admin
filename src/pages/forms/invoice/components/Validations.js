import * as yup from 'yup';

export const Validations = yup.object().shape({
  status: yup.string().required('Status is required'),
  dueDate: yup.string().required('Date is required'),
  type: yup.string().required('Type is required'),
  dateCreated: yup.string().required('Created Date is required')
});
