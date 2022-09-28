import React from 'react';
import {Snackbar} from '@material-ui/core';
import Alert from "./Alert";

const Toast = ({isOpen, message, type="info", onClose}) => {
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={3000}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={type}>{message}</Alert>
    </Snackbar>
  )
};

export default Toast;
