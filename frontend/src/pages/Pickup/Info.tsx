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
            <TextField label="リングQR" variant="outlined" sx={{ flex: 1}} size="small" value={lotInfo != null ? lotInfo["resname"] : ''} />
            <Button variant="contained" size="large">{<SearchIcon /> }</Button>
        </Box>
    )
}
export default Info