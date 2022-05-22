import { useState } from 'react';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Divider, Typography, Stack } from '@mui/material';
// redux
import { PDFDownloadLink } from '@react-pdf/renderer';
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

export default function CheckoutOrderComplete({ user, dataToPrint, ...other }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { orders } = useSelector((state) => state.order);
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

        <Stack spacing={2}>
          <PDFDownloadLink
            document={<InvoicePDF key={user._id} invoice={dataToPrint} user={user} clients={clients.data} />}
            fileName="INVOICE - IDAN"
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <LoadingButton
                size="large"
                fullWidth
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
      </Box>
    </DialogStyle>
  );
}
