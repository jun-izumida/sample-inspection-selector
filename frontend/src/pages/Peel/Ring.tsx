import { Box } from "@mui/material"
import { useContext } from "react"
import { PeelContext } from "../../store/peel"

const Ring = () => {
    const { peelState } = useContext(PeelContext)
    return (
        <Box className="box-ring" >
            <Box className={`box-ring-1 ${peelState.activeSample != null && peelState.activeSample["sequence"] == "1" ? 'active': ''}`} >1</Box>
            <Box className={`box-ring-2 ${peelState.activeSample != null && peelState.activeSample["sequence"] == "2" ? 'active': ''}`} >2</Box>
            <Box className={`box-ring-3 ${peelState.activeSample != null && peelState.activeSample["sequence"] == "3" ? 'active': ''}`} >3</Box>
            <Box className={`box-ring-4 ${peelState.activeSample != null && peelState.activeSample["sequence"] == "4" ? 'active': ''}`} >4</Box>
        </Box>
    )
}
export default Ring