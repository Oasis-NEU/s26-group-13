import { Snackbar, Alert } from '@mui/material';
import useToastStore from '../../store/toastStore';

export default function ToastNotification() {
  const { message, open, severity, hideToast } = useToastStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={2500}
      onClose={hideToast}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={hideToast}
        severity={severity}
        variant="filled"
        sx={{ minWidth: 240 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
