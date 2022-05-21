import { useState } from 'react';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Divider, Typography, Stack, Tooltip, IconButton, DialogActions } from '@mui/material';
// redux
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import closeFill from '@iconify/icons-eva/close-fill';
import downloadFill from '@iconify/icons-eva/download-fill';
// redux
import { useDispatch, useSelector } from '../../../../../redux/store';
import { resetCart } from '../../../../../redux/slices/products';
// routes
import { PATH_ADMIN } from '../../../../../routes/paths';
//
import { DialogAnimate } from '../../../../../components/animate';

import { OrderCompleteIllustration } from '../../../../../assets';
import InvoicePDF from './invoice-to-pdf/InvoicePDF';

// ----------------------------------------------------------------------

const DialogStyle = styled(DialogAnimate)(({ theme }) => ({
  '& .MuiDialog-paper': {
    margin: 0,
    [theme.breakpoints.up('md')]: {
      maxWidth: 'calc(100% - 48px)',
      maxHeight: 'calc(100% - 48px)'
    }
  }
}));

// ----------------------------------------------------------------------
CheckoutOrderComplete.propTypes = {
  user: PropTypes.object
};

export default function CheckoutOrderComplete({ user, ...other }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { clients } = useSelector((state) => state.client);
  const [openPDF, setOpenPDF] = useState(false);

  const handleOpenPreview = () => {
    setOpenPDF(true);
  };

  const handleClosePreview = () => {
    setOpenPDF(false);
  };
  const handleResetStep = () => {
    dispatch(resetCart());
    navigate(PATH_ADMIN.directories.shop);
  };

  return (
    <DialogStyle fullScreen {...other}>
      <Box sx={{ p: 4, maxWidth: 480, margin: 'auto' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" paragraph>
            Thank you for your purchase!
          </Typography>

          <OrderCompleteIllustration sx={{ height: 260, my: 10 }} />

          <Typography align="left" paragraph>
            Thanks for placing order &nbsp;
            <Link href="#">01dc1370-3df6-11eb-b378-0242ac130002</Link>
          </Typography>

          <Typography align="left">
            We will send you a notification within 5 days when it ships.
            <br /> <br /> If you have any question or queries then fell to get in contact us. <br /> <br /> All the
            best,
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Stack direction={{ xs: 'column-reverse', sm: 'row' }} justifyContent="space-between" spacing={2}>
          <LoadingButton size="small" variant="contained" color="success" endIcon={<Icon icon={downloadFill} />}>
            Print
          </LoadingButton>

          <PDFDownloadLink
            document={<InvoicePDF key={user._id} invoice={orders.data} user={user} clients={clients.data} />}
            fileName={`INVOICE-${orders.data[0]?.orderInfo.orderId}` || 'INVOICE-789'}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <LoadingButton
                size="small"
                loading={loading}
                variant="contained"
                loadingPosition="end"
                endIcon={<Icon icon={downloadFill} />}
              >
                Download
              </LoadingButton>
            )}
          </PDFDownloadLink>
        </Stack>

        <DialogAnimate fullScreen open={openPDF}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <DialogActions
              sx={{
                zIndex: 9,
                padding: '12px !important',
                boxShadow: (theme) => theme.customShadows.z8
              }}
            >
              <Tooltip title="Close">
                <IconButton color="inherit" onClick={handleClosePreview}>
                  <Icon icon={closeFill} />
                </IconButton>
              </Tooltip>
            </DialogActions>
            <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
              <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                <InvoicePDF invoice={orders.data} />
              </PDFViewer>
            </Box>
          </Box>
        </DialogAnimate>
      </Box>
    </DialogStyle>
  );
}
