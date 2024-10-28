import { Box, Typography } from "@mui/material"
import { useContext } from "react";
import { PickUpContext } from "../../store/pickup";

const Info = () => {
    const { pickupState } = useContext(PickUpContext)
    return (
        <Box sx={{width: '100%', textAlign: 'center'}}>
            <Typography>{pickupState.result != null ? pickupState.result.resname : ''}</Typography>
        </Box>
    )
}
export default Info