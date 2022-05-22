import PropTypes from 'prop-types';

import { Grid, Stack } from '@mui/material';
import InvoiceInformation from './ClientInformation';
import ClientInvoice from './ClientInvoice';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

RouteAbout.propTypes = {
  invoice: PropTypes.object
};
export default function RouteAbout({ invoice }) {
  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        <Stack spacing={3}>
          <InvoiceInformation invoice={invoice} />
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack sx={{ pl: 3 }}>
          <ClientInvoice invoice={invoice} />
        </Stack>
      </Grid>
    </Grid>
  );
}
