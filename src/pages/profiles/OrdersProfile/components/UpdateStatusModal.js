import React, { useState } from 'react';
import { FormLabel, Grid, MenuItem, TextField, Modal, Typography, Button, Select, Box } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid green',
  borderRadius: '24px',
  boxShadow: 24,
  p: 4
};
const statuses = ['pending', 'delivered', 'cancelled'];

export default function UpdateStatusModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChangeStatus = (status) => {
    handleOpen();
  };
  return (
    <div>
      <Button onClick={() => setOpen(true)} variant="contained">
        Change Status
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Update Status
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormLabel sx={{ pr: 2 }}>Select Status To Change</FormLabel>
              <Select fullWidth>
                <MenuItem value={statuses[0]}>{statuses[0]}</MenuItem>
                <MenuItem value={statuses[1]}>{statuses[1]}</MenuItem>
                <MenuItem value={statuses[2]}>{statuses[2]}</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleClose}>
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
