import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { Tab, TabList, Tabs } from "@mui/joy";
import { InputDialog } from "../../components/InputDialog";
import { DEMO_FRAME } from "./Index";
import { useContext, useState } from "react";
import { PeelContext } from "../../store/peel";

const Selection = () => {
    const { peelState, peelDispatch } = useContext(PeelContext)

    const [frame, setFrame] = useState(["", "", "", "", ""])

    const handleChange = (e: any, i: number) => {
        const next = frame
        next[i] = e.target.value
        setFrame([...next])
    }

    const handleChangeActiveStage = (e:any) => {
        peelDispatch({type:"setActiveStage", payload: e.target.attributes['attr-stage'].value })
    }

    return (
        <Box>
            {peelState.stages.map((stage: number, i: number) => {
                return (
                    <Box
                        className={peelState.activeStage == stage ? 'active-stage' : ''}
                        key={i}
                        component="form"
                        sx={{ '& > :not(style)': { m: 1, width: '25ch' }, display: 'flex', alignItems: 'center' }}
                        noValidate
                        autoComplete="off"
                        attr-stage={stage}
                        onClick={handleChangeActiveStage}
                    >
                        <Typography sx={{ maxWidth: '60px !important' }}>{`${stage}段目`}</Typography>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="demo-select-small-label">Frame</InputLabel>
                            <Select
                                labelId="frame-label"
                                id="frame-label"
                                value={""}
                                label="frame"
                                onChange={(e) => handleChange(e, i)}
                            >
                                {peelState.pickUpPeelSamples != null && peelState.pickUpPeelSamples.filter((v:any) => v.stage == String(stage)).length > 0 ?
                                    peelState.pickUpPeelSamples.filter((v:any) => v.stage == String(stage))[0]["lots"].map((sample:any) => {
                                        return (
                                            <MenuItem value={sample.dmLot}>
                                                <em>{`${sample.dmLot} - ${sample.sequence}`}</em>
                                            </MenuItem>
                                        )
                                    })
                                : null}
                                {/*DEMO_FRAME[i].map((w: string, j: number) => {
                                    return (
                                        <MenuItem value={w}>
                                            <em>{w}</em>
                                        </MenuItem>
                                    )
                                })*/}
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