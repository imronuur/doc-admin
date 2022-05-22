import * as yup from 'yup';

export const Validations = yup.object().shape({
  // discount: yup.string().required('discount is required'),
  dueDate: yup.date().required('Date is required'),
  type: yup.mixed().required('Type is required'),
  dateCreated: yup.date().required('Created Date is required')
  // refTo: yup.mixed().required('RefTo is required')
  // unitPrice: yup.string().required('Unit Price is required'),
  // invoiceNumber: yup.string()
});
