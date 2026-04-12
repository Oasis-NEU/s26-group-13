import { Snackbar, Alert, Button } from '@mui/material';
import useToastStore from '../../store/toastStore';

export default function ToastNotification() {
  const { message, open, severity, onUndo, hideToast } = useToastStore();

  const handleUndo = () => {
    onUndo?.();
    hideToast();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={onUndo ? 5000 : 2500}
      onClose={hideToast}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={hideToast}
        severity={severity}
        variant="filled"
        sx={{ minWidth: 240 }}
        action={
          onUndo ? (
            <Button color="inherit" size="small" onClick={handleUndo} sx={{ fontWeight: 700 }}>
              UNDO
            </Button>
          ) : undefined
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
