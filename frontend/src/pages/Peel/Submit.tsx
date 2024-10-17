import { AppBar, Box, Button } from "@mui/material"

export const Submit = () => {
    return (
        <Box className="submit-form" sx={{backgroundColor: 'primary.main'}}>
            <Button variant="contained" >登録</Button>
        </Box>
    )
}