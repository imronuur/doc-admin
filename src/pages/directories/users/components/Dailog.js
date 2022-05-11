import * as React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';

AlertDialog.propTypes = {
  handleClose: PropTypes.func,
  handleAgree: PropTypes.func,
  id: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.string,
  loading: PropTypes.bool,
  open: PropTypes.bool
};

export default function AlertDialog({ handleClose, role, handleAgree, email, id, loading, open }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">"Are sure you want to delete this User??"</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography color="red" variant="h5">
            This not a recommended way to delete users!
          </Typography>{' '}
          You can ban this user and he/her won't be able to access your platform, deleting Users like this will remove
          the user from your database which is not recommended, please if you will to proceed click agree, if not click
          diagree. Thanks.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleClose}>
          Disagree
        </Button>
        <Button color="error" disabled={loading} onClick={() => handleAgree(id, email, role)} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
