import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack } from "@mui/material";

type Props = {
    open: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onClose: (confirmed: boolean) => void;
};

export default function ConfirmDialog({
                                          open,
                                          title = "TaskRaum",
                                          message,
                                          confirmText = "Confirm",
                                          cancelText = "Cancel",
                                          onClose,
                                      }: Props) {
    return (
        <Dialog open={open} onClose={() => onClose(false)} fullWidth maxWidth="xs">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Stack mt={0.5}>
                    <Typography variant="body2">{message}</Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)}>{cancelText}</Button>
                <Button variant="contained" color="error" onClick={() => onClose(true)}>
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}