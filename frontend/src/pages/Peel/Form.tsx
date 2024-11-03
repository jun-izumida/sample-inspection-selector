import { Box, Button, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { useContext, useEffect, useRef, useState } from "react";
import { PeelContext } from "../../store/peel";

interface FormPropType {
    handleSearchResult: (result: string) => void
}

const Form = ({ handleSearchResult }:FormPropType ) => {
    const { peelState } = useContext(PeelContext)
    const [ searchText, setSearchText] = useState("")
    const inputRef = useRef<HTMLDivElement>(null)

    const handleChangeSearchText = (e: any) => {
        if (e.key == "Enter") {
            e.preventDefault()
            handleSearchResult(searchText)
        }
    }

    const handleSearch = () => {
        handleSearchResult(searchText)
    }


    useEffect(() => {
        setSearchText("")
        setTimeout(() => {
            if (inputRef != null && inputRef.current != null) {
                if (inputRef.current.querySelector('input[name="qr"]') != null) {
                    const elem: HTMLElement | null = inputRef.current.querySelector('input[name="qr"]')
                    if (elem != null) {
                        console.log(elem)
                        elem.focus()
                    }
                }
            }
        }, 100)
    }, [peelState.timestamp])

    return (
        <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '14ch' }, display: 'flex', alignItems: 'center'}}
            noValidate
            autoComplete="off"
        >
            <TextField ref={inputRef} label="製造ロットQR" placeholder="00AA00A0000-1-1" name="qr" variant="outlined" sx={{ flex: 1 }} size="small" value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyDown={handleChangeSearchText} />
            <Button variant="contained" size="large" onClick={() => handleSearch()}>{<SearchIcon />}</Button>
        </Box>
    )
}
export default Form