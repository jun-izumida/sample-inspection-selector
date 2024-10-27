import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Slide, Typography } from "@mui/material"
import { QRCodeSVG } from "qrcode.react"
import React, { forwardRef, useEffect, useState } from "react";
import { TransitionProps } from '@mui/material/transitions';

interface QRCodeDialogProps {
    sx?: any
    values?: string[]
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const QRCodeDialog = ({sx, values}: QRCodeDialogProps) => {
    const [ isOpened, setIsOpened ] = useState(false)

    const handleOpen = () => {
        setIsOpened(true)
    }

    const handleClose = () => {
        setIsOpened(false) 
    }

    useEffect(() => {

    },[])

    return (
        <>
        <Box sx={sx}>
            <Button variant="contained" onClick={handleOpen}>QR</Button>
        </Box>
        <Dialog open={isOpened}
            TransitionComponent={Transition}
            maxWidth={"lg"}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>QR</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Grid container spacing={4}>
                        {values != undefined ? values.map((v:string, i:number) => {
                            return (
                                <Grid item xs={4} key={i}>
                                    <QRCodeSVG value={v} />
                                    <Typography>{v}</Typography>
                                </Grid>
                            )
                        }): null}
                    </Grid>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}
export default QRCodeDialog