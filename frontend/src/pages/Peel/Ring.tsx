import { Box } from "@mui/material"

const Ring = () => {
    return (
        <Box className="box-ring" >
            <Box className="box-ring-0"></Box>
            <Box className="box-ring-1"></Box>
            <Box className="box-ring-2"></Box>
            <Box className="box-ring-3"></Box>
            <Box className="box-ring-4 active"></Box>
        </Box>
    )
}
export default Ring