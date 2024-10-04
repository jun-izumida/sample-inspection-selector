import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from "@mui/material"
import { QRCodeSVG } from "qrcode.react"
import React, { forwardRef } from "react";
import { TransitionProps } from '@mui/material/transitions';


const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const QRCodeDialog = () => {
    return (
        <Dialog open={false}
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>a</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <QRCodeSVG value={"https://www.google.com/"} />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { }}>Close</Button>
                <Button onClick={() => { }}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}
export default QRCodeDialog