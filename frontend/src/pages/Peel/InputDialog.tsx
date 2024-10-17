import React, { useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

export default function InputDialog() {
  const inputRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
      setTimeout(() => {
        if (inputRef != null && inputRef.current != null) {
          if (inputRef.current.querySelector('input[name="code"]') != null) {
            const elem:HTMLElement | null = inputRef.current.querySelector('input[name="code"]')
            if (elem != null) {
              elem.focus()
            }
          }
        }
      }, 100)
  })

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        読み取り
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogContent>
          <TextField
            ref={inputRef}
            autoFocus
            required
            margin="dense"
            id="name"
            name="code"
            label="code"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">OK</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}