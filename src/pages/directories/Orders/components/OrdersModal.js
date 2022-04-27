import React from 'react';
import { Modal, Box, Button, Select, MenuItem, Typography, Grid, FormLabel } from '@mui/material';
import { FormikProvider, Form, useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';

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
const statuses = ['Not Processed', 'Cash On Delivery', 'processing', 'Dispatched', 'Cancelled', 'Completed'];

export default function OrdersModal({ open, handleClose, handleUpdateOrder, orderId }) {
  const formik = useFormik({
    initialValues: {
      orderStatus: 'Not Proccessed',
      orderId
    },
    onSubmit: (values, { setSubmitting, setErrors }) => {
      try {
        handleUpdateOrder(values);
        handleClose();
        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  });
  const { handleSubmit, getFieldProps } = formik;
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Update Status
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormLabel sx={{ pr: 2 }}>Select Status To Change</FormLabel>

                  <Select fullWidth {...getFieldProps('orderStatus')}>
                    {statuses.map((status, index) => (
                      <MenuItem value={status} key={index}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <LoadingButton variant="contained" type="submit">
                    Save Changes
                  </LoadingButton>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </Box>
      </Modal>
    </div>
  );
}
