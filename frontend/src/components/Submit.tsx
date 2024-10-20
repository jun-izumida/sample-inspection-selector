import React, { ReactNode } from 'react'
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import { AppBar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"

interface SubmitPropType {
    dialogTitle?: string
    dialogContent?: ReactNode
    handleSubmit?: (callback?:() => void) => void
}
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const Submit = ({ dialogTitle, dialogContent, handleSubmit }: SubmitPropType) => {
    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleConfirm = () => {
        if (handleSubmit != undefined) {
            handleSubmit(() => {
                setOpen(false)
            })
        }
    }

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <Box className="submit-form" sx={{ backgroundColor: 'primary.main' }}>
            <Button variant="contained" onClick={handleClickOpen}>登録</Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
            >
                <DialogTitle></DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogTitle != null ? dialogTitle : "登録しますか？"}</DialogContentText>
                    {dialogContent != null ? dialogContent : null} 
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>いいえ</Button>
                    <Button onClick={handleConfirm}>はい</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}