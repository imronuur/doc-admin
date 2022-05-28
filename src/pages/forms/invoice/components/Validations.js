import * as yup from 'yup';

export const Validations = yup.object().shape({
  // discount: yup.string().required('discount is required'),
  dueDate: yup.date().required('Date is required'),
  type: yup.mixed().required('Type is required'),
  status: yup.mixed().required('Status is required'),
  dateCreated: yup.date().required('Created Date is required'),
  discount: yup.number().required('Discount is required'),
  items: yup.array().of(
    yup.object().shape({
      unitPrice: yup.number().required('Unit Price is required'),
      itemName: yup.string().required('Item Name is required'),
      quantity: yup.number().required('Quantity is required')
    })
  ),

  refTo: yup.string().required('Client Reference Field is required')
  // unitPrice: yup.string().required('Unit Price is required'),
  // invoiceNumber: yup.string()
});
