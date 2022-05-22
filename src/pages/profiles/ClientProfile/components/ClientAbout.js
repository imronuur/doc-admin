import PropTypes from 'prop-types';

import { Grid, Stack } from '@mui/material';
import ClientInformation from './ClientInformation';
import ClientOrder from './ClientOrder';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

RouteAbout.propTypes = {
  client: PropTypes.object
};

export default function RouteAbout({ client, order }) {
  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        <Stack spacing={3}>
          <ClientInformation client={client} />
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack sx={{ pl: 3 }}>
          <ClientOrder order={order} />
        </Stack>
      </Grid>
    </Grid>
  );
}
