import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { Icon } from '@iconify/react';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
import { useSnackbar } from 'notistack';

// material
import { styled } from '@mui/material/styles';
import { Box, Grid, Step, Stepper, Container, StepLabel, StepConnector } from '@mui/material';
// redux
// routes
import closeFill from '@iconify/icons-eva/close-fill';
import { PATH_ADMIN } from '../../../../routes/paths';
// hooks
import { useDispatch, useSelector } from '../../../../redux/store';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import useSettings from '../../../../hooks/useSettings';
import { getCart, createBilling } from '../../../../redux/slices/products';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { CheckoutCart, CheckoutPayment, CheckoutOrderComplete, CheckoutBillingAddress } from './checkout/index';
import { createOrder } from '../../../../redux/thunk/orderThunk';
import { MIconButton } from '../../../../components/@material-extend';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------

const STEPS = ['Cart', 'Billing & address', 'Payment'];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: 'calc(-50% + 20px)',
  right: 'calc(50% + 20px)',
  '& .MuiStepConnector-line': {
    borderTopWidth: 2,
    borderColor: theme.palette.divider
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main
    }
  }
}));

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool
};

function QontoStepIcon({ active, completed }) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'primary.main' : 'text.disabled'
      }}
    >
      {completed ? (
        <Box component={Icon} icon={checkmarkFill} sx={{ zIndex: 1, width: 20, height: 20, color: 'primary.main' }} />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor'
          }}
        />
      )}
    </Box>
  );
}

export default function EcommerceCheckout() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const { checkout } = useSelector((state) => state.product);
  const { cart, billing, activeStep } = checkout;
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const isComplete = activeStep === STEPS.length;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (isMountedRef.current) {
  //     dispatch(getCart(cart));
  //   }
  // }, [dispatch, isMountedRef, cart]);

  useEffect(() => {
    if (activeStep === 1) {
      dispatch(createBilling(null));
    }
  }, [dispatch, activeStep]);

  const handleCreate = async (order) => {
    setLoading(true);

    const reqObject = {
      order
    };

    const reduxRes = await dispatch(createOrder(reqObject));
    if (reduxRes.type === 'order/create/rejected') {
      enqueueSnackbar(`${reduxRes.error.message}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    } else if (reduxRes.type === 'order/create/fulfilled') {
      enqueueSnackbar(`Order Created!`, {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setLoading(false);
    }
  };

  return (
    <Page title="Ecommerce: Checkout | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Checkout"
          links={[
            { name: 'Dashboard', href: PATH_ADMIN.root },
            {
              name: 'E-Commerce',
              href: PATH_ADMIN.root
            },
            { name: 'Checkout' }
          ]}
        />

        <Grid container justifyContent={isComplete ? 'center' : 'flex-start'}>
          <Grid item xs={12} md={8} sx={{ mb: 5 }}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
                    sx={{
                      '& .MuiStepLabel-label': {
                        typography: 'subtitle2',
                        color: 'text.disabled'
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid>

        {!isComplete ? (
          <>
            {activeStep === 0 && <CheckoutCart />}
            {activeStep === 1 && <CheckoutBillingAddress />}
            {activeStep === 2 &&
              billing &&
              cart.map((c, i) => (
                <CheckoutPayment loading={loading} handleCreate={handleCreate} key={i} cart={c} billing={billing} />
              ))}
          </>
        ) : (
          <CheckoutOrderComplete open={isComplete} user={user} />
        )}
      </Container>
    </Page>
  );
}