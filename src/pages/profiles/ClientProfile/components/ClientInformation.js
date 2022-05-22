import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import carFilled from '@iconify/icons-ant-design/car-filled';
import shopFilled from '@iconify/icons-ant-design/shop-filled';
import fileDoneOutlined from '@iconify/icons-ant-design/file-done-outlined';
import userOutlined from '@iconify/icons-ant-design/user-outlined';
// material
import { styled } from '@mui/material/styles';

import { Link, Card, Typography, CardHeader, Stack } from '@mui/material';

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

export default function ClientInformation({ client }) {
  return (
    <CardStyle>
      <CardHeader title="Client Information" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row">
          <IconStyle icon={userOutlined} />
          <Typography variant="body2">{client.name}</Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={userOutlined} />
          <Typography variant="body2">{client.email}</Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={userOutlined} />
          <Typography variant="body2">{client.phone}</Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={userOutlined} />
          <Typography variant="subtitle2" color="text.primary">
            {client.state}
          </Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={userOutlined} />
          <Typography variant="body2">{client?.company || ''}</Typography>
        </Stack>
      </Stack>
    </CardStyle>
  );
}
