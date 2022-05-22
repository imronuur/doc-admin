import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import pinFill from '@iconify/icons-eva/pin-fill';
import emailFill from '@iconify/icons-eva/email-fill';
import phoneCallFill from '@iconify/icons-eva/phone-call-fill';
import roundBusinessCenter from '@iconify/icons-ic/round-business-center';
import userOutlined from '@iconify/icons-ant-design/user-outlined';

// material
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack } from '@mui/material';

// ----------------------------------------------------------------------

const IconStyle = styled(Icon)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2)
}));

// ----------------------------------------------------------------------

ProfileAbout.propTypes = {
  currentUser: PropTypes.object
};

export default function ProfileAbout({ currentUser }) {
  return (
    <Card>
      <CardHeader title="About" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row">
          <IconStyle icon={userOutlined} />
          <Typography variant="body2">{currentUser?.name}</Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={pinFill} />
          <Typography variant="body2">
            Live at &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {currentUser?.address?.address1 || 'Somalia'}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={emailFill} />
          <Typography variant="body2">{currentUser?.email}</Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={phoneCallFill} />
          <Typography variant="body2">{currentUser?.phone}</Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={roundBusinessCenter} />
          <Typography variant="body2">{currentUser?.state}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
