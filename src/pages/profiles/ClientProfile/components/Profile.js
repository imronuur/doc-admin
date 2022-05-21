import PropTypes from 'prop-types';
// material
import { Grid, Stack } from '@mui/material';
//
import ProfileAbout from './ProfileAbout';
import ClientOrder from './ClientOrder';

// ----------------------------------------------------------------------

Profile.propTypes = {
  currentUser: PropTypes.object,
  currentOrder: PropTypes.object
};

export default function Profile({ currentUser, currentOrder }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <ProfileAbout currentUser={currentUser} />
        </Stack>
      </Grid>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <ClientOrder order={currentOrder} />
        </Stack>
      </Grid>
    </Grid>
  );
}
