import { Box, Button, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';

interface InfoPropType {
    lotInfo: any
}

const Info = ({lotInfo}: InfoPropType) => {
    console.log(lotInfo)
    return (
        <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '25ch' }, display: 'flex', alignItems: 'center'}}
            noValidate
            autoComplete="off"
        >
        </Box>
    )
}
export default Info