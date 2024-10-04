import { Box, Button, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import { ConstructionOutlined } from "@mui/icons-material";

interface FormPropType {
    handleSearchResult: (result:string) => void
}

const Form = ({handleSearchResult}:FormPropType) => {
    const [ searchText, setSearchText ] = useState("")

    const handleChangeSearchText = (e:any) => {
        if (e.key == "Enter") {
            e.preventDefault()
            handleSearchResult(searchText)
        }
    }

    const handleSearch = () => {
        handleSearchResult(searchText)
    }
    return (
        <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '14ch' }, display: 'flex', alignItems: 'center'}}
            noValidate
            autoComplete="off"
        >
            <TextField label="リングQR" variant="outlined" sx={{ flex: 1}} size="small" onChange={(e) => setSearchText(e.target.value)} onKeyDown={handleChangeSearchText} />
            <Button variant="contained" size="large" onClick={() => handleSearch()}>{<SearchIcon /> }</Button>
        </Box>
    )
}
export default Form