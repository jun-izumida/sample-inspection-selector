import { Box, Button, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { useContext } from "react";
import { PeelContext } from "../../store/peel";

const Form = () => {
    const { peelState, peelDispatch } = useContext(PeelContext)

    console.log(peelState)
    return (
        <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '14ch' }, display: 'flex', alignItems: 'center'}}
            noValidate
            autoComplete="off"
        >
            <TextField label="リングQR" variant="outlined" sx={{ flex: 1}} size="small" />
            <Button variant="contained" size="large">{<SearchIcon /> }</Button>
        </Box>
    )
}
export default Form