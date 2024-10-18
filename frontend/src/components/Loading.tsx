import { Box } from "@mui/material"

export const Loading = () => {
    return (
        <Box className="loading-overlay">
            <Box className="loading-rotate">
                <Box className="loading-move">
                    <Box className="loading-dot"></Box>
                </Box>
                <Box className="loading-ring"></Box>
            </Box>
            <p className="loading-text">loading...</p>
        </Box>
    )
}