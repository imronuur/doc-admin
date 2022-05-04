import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import carFilled from '@iconify/icons-ant-design/car-filled';
import calendarFilled from '@iconify/icons-ant-design/calendar-filled';
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

export default function InvoiceInformation({ invoice }) {
  return (
    <CardStyle>
      <CardHeader title="Client Information" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row">
          <IconStyle icon={userOutlined} />
          <Typography variant="body2">
            Client Name :-
            <span style={{ paddingLeft: 10, fontWeight: 800 }}>{invoice.refTo.name}</span>
          </Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={userOutlined} />
          <Typography variant="body2">
            Client Email :-
            <span style={{ paddingLeft: 10, fontWeight: 800 }}>{invoice.refTo.email}</span>
          </Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={userOutlined} />
          <Typography variant="body2">
            Phone Number :-
            <span style={{ paddingLeft: 10, fontWeight: 800 }}>{invoice.refTo.phone}</span>
          </Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={userOutlined} />
          <Typography variant="body2">
            State :-
            <span style={{ paddingLeft: 10, fontWeight: 800 }}>{invoice.refTo.state}</span>
          </Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={userOutlined} />
          <Typography variant="body2">
            Company :-
            <span style={{ paddingLeft: 10, fontWeight: 800 }}>{invoice.refTo.company}</span>
          </Typography>
        </Stack>
      </Stack>
    </CardStyle>
  );
}
