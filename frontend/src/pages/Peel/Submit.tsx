import { ReactNode } from 'react'
import { Box } from "@mui/material"

interface SubmitPropType {
    children?: ReactNode
}

export const Submit = ({ children }: SubmitPropType) => {
    return (
        <Box className="submit-form" sx={{ backgroundColor: 'primary.main', zIndex:2 }}>
            {children != undefined ? 
                children
            : null}
        </Box>
    )
}