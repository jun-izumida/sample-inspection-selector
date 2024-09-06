import { Box, Button, TextField, Typography } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { Tab, TabList, Tabs } from "@mui/joy";

const Selection = () => {
    return (
        <Box>
            {[1,2,3,4].map((v) => {
                return (
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' }, display: 'flex', alignItems: 'center'}}
                noValidate
                autoComplete="off"
            >
                <TextField label="フレーム" variant="standard" sx={{ flex: 1 }} size="small" />
                <TextField label="リングQR" variant="outlined" sx={{ flex: 1}} size="small" />
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