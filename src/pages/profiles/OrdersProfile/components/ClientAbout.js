import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import carFilled from '@iconify/icons-ant-design/car-filled';
import calendarFilled from '@iconify/icons-ant-design/calendar-filled';
import shopFilled from '@iconify/icons-ant-design/shop-filled';
import fileDoneOutlined from '@iconify/icons-ant-design/file-done-outlined';
import userOutlined from '@iconify/icons-ant-design/user-outlined';
// material
import { styled } from '@mui/material/styles';
import { Link, Card, Grid, Typography, CardHeader, Stack, Container } from '@mui/material';

// ----------------------------------------------------------------------

const IconStyle = styled(Icon)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2)
}));

const CardStyle = styled(Card)(({ theme }) => ({
  paddingBottom: theme.spacing(0)
}));

// ----------------------------------------------------------------------

RouteAbout.propTypes = {
  client: PropTypes.object
};

export default function RouteAbout({
  client = {
    name: 'Completed',
    email: 'Amazon',
    phone: '1999-01-01',
    state: '1999-02-01',
    company: 'Smith'
  }
}) {
  return (
    <Grid container spacing={24} fullWidth>
      <Grid item xs={12}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={2} sx={{ p: 3 }}>
            <Stack direction="row">
              <Typography variant="body2">{client.name}</Typography>
            </Stack>

            <Stack direction="row">
              <Typography variant="body2">{client.email}</Typography>
            </Stack>
            <Stack direction="row">
              <Typography variant="body2">{client.phone}</Typography>
            </Stack>
            <Stack direction="row">
              <Typography variant="subtitle2" color="text.primary">
                {client?.state}
              </Typography>
            </Stack>
            <Stack direction="row">
              <Typography variant="body2">{client?.company || ''}</Typography>
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
