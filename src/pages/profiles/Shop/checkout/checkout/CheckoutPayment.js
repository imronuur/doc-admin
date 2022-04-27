import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { Grid, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { v4 as uuidv4 } from 'uuid';
// redux
import { useDispatch, useSelector } from '../../../../../redux/store';
import { onGotoStep, onBackStep, onNextStep, applyShipping } from '../../../../../redux/slices/products';

//
import CheckoutSummary from './CheckoutSummary';
import CheckoutDelivery from './CheckoutDelivery';
import CheckoutBillingInfo from './CheckoutBillingInfo';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
import useAuth from '../../../../../hooks/useAuth';
// ----------------------------------------------------------------------

const DELIVERY_OPTIONS = [
  {
    value: 0,
    title: 'Standard delivery (Free)',
    description: 'Delivered on Monday, August 12'
  },
  {
    value: 2,
    title: 'Fast delivery ($2,00)',
    description: 'Delivered on Monday, August 5'
  }
];

const PAYMENT_OPTIONS = [
  {
    value: 'e-dahab',
    title: 'E-DAHAB',
    description: 'Ku Bixi E-Dahab.',
    icons: [
      'https://cdn.shortpixel.ai/spai/w_158+q_lossy+ret_img+to_webp/https://somtelmain.smgtsystems.com/wp-content/uploads/2020/12/redefine-Somtel-Logo.png'
    ]
  },
  {
    value: 'evc-plus',
    title: 'EVC-PLUS',
    description: 'Ku Bixi EVC-PLUS.',
    icons: ['https://i1.wp.com/afrotech.so/wp-content/uploads/2019/04/EVC-PLUS-Logo-01-230x128.png?fit=230%2C128&ssl=1']
  }
];

const CARDS_OPTIONS = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' }
];

// ----------------------------------------------------------------------

export default function CheckoutPayment({ billing, handleCreate, loading, cart }) {
  const dispatch = useDispatch();
  const { checkout } = useSelector((state) => state.product);
  const { total, discount, subtotal, shipping } = checkout;
  const { user } = useAuth();

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  const handleApplyShipping = (value) => {
    dispatch(applyShipping(value));
  };

  const ValidationS = Yup.object().shape({
    paymentType: Yup.mixed().required('Payment is required')
  });

  const formik = useFormik({
    initialValues: {
      products: [
        {
          _id: cart._id,
          count: cart.quantity,
          size: cart.size
        }
      ],
      orderInfo: {
        orderId: uuidv4(),
        amount: total
      },
      orderStatus: 'Not Processed',
      orderBy: '62516ee84f2c551bf8d92533',
      orderTo: billing._id,
      paymentType: ''
    },
    validationSchema: ValidationS,
    onSubmit: (values, { setErrors, setSubmitting }) => {
      try {
        console.log(values);
        handleCreate(values);
        handleNextStep();
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error.message);
      }
    }
  });
  const { isSubmitting, handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <CheckoutDelivery
              formik={formik}
              onApplyShipping={handleApplyShipping}
              deliveryOptions={DELIVERY_OPTIONS}
            />
            <CheckoutPaymentMethods formik={formik} cardOptions={CARDS_OPTIONS} paymentOptions={PAYMENT_OPTIONS} />
            <Button
              type="button"
              size="small"
              color="inherit"
              onClick={handleBackStep}
              startIcon={<Icon icon={arrowIosBackFill} />}
            >
              Back
            </Button>
          </Grid>

          <Grid item xs={12} md={4}>
            <CheckoutBillingInfo onBackStep={handleBackStep} />
            <CheckoutSummary
              enableEdit
              total={total}
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              onEdit={() => handleGotoStep(0)}
            />
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
              Complete Order
            </LoadingButton>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
