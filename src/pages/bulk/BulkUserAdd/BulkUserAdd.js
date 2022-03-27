import * as React from 'react';
import PropTypes from 'prop-types';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
import { Table, TableHead, TableRow, TableCell, TableBody, Container, Typography, Button, Grid } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import useSettings from '../../../../hooks/useSettings';

import { UserBulkMore } from '../components';
import { loadBulkUsers } from '../../../../redux/slices/bulkStaffSlice';

let content = null;

BulkUserAdd.propTypes = {
  users: PropTypes.array,
  handleBulkAdd: PropTypes.func,
  setBulkUsers: PropTypes.func,
  handleBulkUserUpload: PropTypes.func,
  loading: PropTypes.bool
};

export default function BulkUserAdd({ users, handleBulkAdd, setBulkUsers, handleBulkUserUpload, loading }) {
  const { auth, bulkStaff } = useSelector((state) => ({ ...state }));

  const { bulkUsers } = bulkStaff;
  const dispatch = useDispatch();
  const handleRemove = (id) => {
    dispatch(loadBulkUsers(bulkUsers.filter((v) => v.id !== id)));
  };
  const { themeStretch } = useSettings();

  if (users && users.length > 0) {
    content = (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            sx={{
              fontSize: 30,
              alignItems: 'center',
              margin: 'auto'
            }}
            variant="h6"
          >
            {`Added ${users.length} Users`}
          </Typography>
        </Grid>

        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>ZIP</TableCell>
              <TableCell>dateOfBirth</TableCell>
              <TableCell>phone</TableCell>
              <TableCell>ssn</TableCell>
              <TableCell>Is Driver</TableCell>
            </TableRow>
          </TableHead>
          {users.map((user, index) => (
            <TableBody key={index}>
              <TableRow>
                <TableCell align="left">{user.name}</TableCell>
                <TableCell align="left">{user.email}</TableCell>
                <TableCell align="left">{user.address}</TableCell>
                <TableCell align="left">{user.city}</TableCell>
                <TableCell align="left">{user.state}</TableCell>
                <TableCell align="left">{user.zip}</TableCell>
                <TableCell align="left">{user.dateOfBirth}</TableCell>
                <TableCell align="left">{user.phone}</TableCell>
                <TableCell align="left">{user.ssn}</TableCell>

                <TableCell align="left">{user.isDriver}</TableCell>
                <TableCell align="right">
                  <UserBulkMore id={user.id} onDelete={() => handleRemove(user.id)} />
                </TableCell>
              </TableRow>
            </TableBody>
          ))}
        </Table>
        <Button
          variant="outlined"
          sx={{
            marginBottom: '1%',
            marginLeft: '1%'
          }}
          startIcon={<Icon icon={plusFill} />}
          onClick={() => handleBulkUserUpload(auth.token, users)}
          disabled={loading}
        >
          Upload Users
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{
            marginBottom: '1%',
            marginLeft: '1%'
          }}
          onClick={() => setBulkUsers([])}
          disabled={loading}
          startIcon={<Icon icon={plusFill} />}
        >
          Remove
        </Button>
      </Grid>
    );
  } else {
    content = (
      <>
        <Typography
          sx={{
            fontSize: 30,
            alignItems: 'center',
            margin: 'auto'
          }}
          variant="h6"
        >
          No Bulk Added Users
        </Typography>
        <Button
          variant="outlined"
          component="label"
          sx={{
            marginBottom: '1%',
            marginLeft: '1%'
          }}
          startIcon={<Icon icon={plusFill} />}
        >
          <input type="file" accept="text/csv" hidden onChange={(e) => handleBulkAdd(e)} />
          Add User
        </Button>
      </>
    );
  }
  return <Container maxWidth={themeStretch ? false : 'lg'}>{content}</Container>;
}
