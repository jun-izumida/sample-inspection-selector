import { Box, Button, Checkbox, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
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

    /*
    const handleChangeActiveStage = (e: any) => {
        peelDispatch({ type: "setActiveStage", payload: e.target.attributes['attr-stage'].value })
    }
        */

    const handleCheckSample = (target: any, stage: string, dmLot:string, sequence: string) => {
        peelDispatch({type:"setIsUse", payload:{"stage": stage, "dmLot": dmLot, "sequence": sequence, "checked": target.checked}})
    }

    return (
        <Box>
            {peelState.stages.map((stage: number, i: number) => {
                return (
                    <Box>
                        <Box
                            className={peelState.activeStage == stage ? 'active-stage' : ''}
                            key={i}
                            sx={{ display: 'flex', py:1}}
                            attr-stage={stage}
                            onClick={() => {/*handleChangeActiveStage*/}}
                        >
                            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} sx={{width: '72px', backgroundColor: '#e6f8ff'}} >
                                <Typography>{`${stage}段目`}</Typography>
                            </Box>
                            <Box sx={{width: '100%'}}>
                                {peelState.pickUpPeelSamples != null && peelState.pickUpPeelSamples.filter((v: any) => v.stage == String(stage)).length > 0 ?
                                    (peelState.pickUpPeelSamples.filter((v: any) => v.stage == String(stage))[0]["lots"]).sort((a:any, b:any) => {
                                        if (a.dmLot < b.dmLot) return -1;
                                        if (a.dmLot > b.dmLot) return 1;
                                        return 0;
                                    }).map((sample: any) => {
                                        return (
                                            <Box display={'flex'} alignItems={'center'} gap={'10px'} sx={{my:1, pl:1, background: sample.isUse ? 'initial' : 'gray'}}>
                                                <Checkbox color="primary" checked={sample.isUse} inputProps={{ 'aria-label': 'controlled' }} onClick={(e) => handleCheckSample(e.target, String(stage), sample.dmLot, sample.sequence)}></Checkbox>
                                                <Typography sx={{mx:2}}>{`${sample.dmLot} - ${sample.sequence}`}</Typography>
                                                <InputDialog isDisabled={!sample.isUse} />
                                                <Box sx={{ height: '36px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid lightgray', minWidth: '100px' }}>照合OK</Box>
                                                {sample.isUse ?
                                                <Tabs aria-label="Basic tabs" value={0} tabIndex={-1}>
                                                    <TabList disableUnderline>
                                                        <Tab sx={{ width: '100%' }} color={"danger"} tabIndex={-1}>NG</Tab>
                                                        <Tab sx={{ width: '100%' }} color={"success"} tabIndex={-1}>OK</Tab>
                                                    </TabList>
                                                </Tabs> : null}
                                            </Box>
                                        )
                                    })
                                    : null}
                            </Box>

                        </Box>
                        <hr style={{ margin: 0, borderStyle: 'none', borderTop: '1px dashed', borderColor: '#9a9a9a' }} />
                    </Box>
                )
            })}
        </Box>
    )
}
export default Selection