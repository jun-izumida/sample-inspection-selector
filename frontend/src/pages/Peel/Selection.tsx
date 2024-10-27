import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { Tab, TabList, Tabs } from "@mui/joy";
import { InputDialog } from "../../components/InputDialog";
import { DEMO_FRAME } from "./Index";
import { useState } from "react";

const Selection = () => {
    const [frame, setFrame] = useState(["", "", "", "", ""])

    const handleChange = (e: any, i: number) => {
        const next = frame
        next[i] = e.target.value
        setFrame([...next])
    }


    return (
        <Box>
            {[1, 2, 3, 4, 5].map((v: number, i: number) => {
                return (
                    <Box
                        key={i}
                        component="form"
                        sx={{ '& > :not(style)': { m: 1, width: '25ch' }, display: 'flex', alignItems: 'center' }}
                        noValidate
                        autoComplete="off"
                    >
                        <Typography sx={{ maxWidth: '60px !important' }}>{`${v}段目`}</Typography>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="demo-select-small-label">Frame</InputLabel>
                            <Select
                                labelId="frame-label"
                                id="frame-label"
                                value={frame[i]}
                                label="frame"
                                onChange={(e) => handleChange(e, i)}
                            >
                                {DEMO_FRAME[i].map((w: string, j: number) => {
                                    return (
                                        <MenuItem value={w}>
                                            <em>{w}</em>
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        <InputDialog />
                        <Box sx={{ height: '36px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid lightgray', minWidth: '100px' }}>照合OK</Box>
                        <Tabs aria-label="Basic tabs" value={0} tabIndex={-1}>
                            <TabList disableUnderline>
                                <Tab sx={{ width: '100%' }} color={"danger"} tabIndex={-1}>NG</Tab>
                                <Tab sx={{ width: '100%' }} color={"success"} tabIndex={-1}>OK</Tab>
                            </TabList>
                        </Tabs>
                    </Box>
                )
            })}
        </Box>
    )
}
export default Selection