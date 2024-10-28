import { Box } from "@mui/material"
import { useContext } from "react"
import { PeelContext } from "../../store/peel"

const Ring = () => {
    const { peelState } = useContext(PeelContext)

    

    return (
        <Box className="box-ring" >
            <Box className="box-ring-1">1</Box>
            <Box className="box-ring-2">2</Box>
            <Box className="box-ring-3">3</Box>
            <Box className="box-ring-4 active">4</Box>
        </Box>
    )
}
export default Ring