import { Box, Checkbox, Typography } from "@mui/material"
import { Tab, TabList, Tabs } from "@mui/joy";
import { InputDialog } from "../../components/InputDialog";
import { useContext } from "react";
import { PeelContext } from "../../store/peel";

const Selection = () => {
    const { peelState, peelDispatch } = useContext(PeelContext)

    const handleCheckSample = (target: any, stage: string, dmCode:string, _: string) => {
        console.log(dmCode)
        peelDispatch({type:"changeStatus", payload:{"stage": stage, "dmCode": dmCode, "field": "isUse", "value": target.checked}})
    }

    const handleValidateSample = (code: string | null, value: string | null) => {
        if (code == null) return
        const codes = code.split("/")
        if (codes[1] == value) {
            peelDispatch({type:"setActiveSample", payload:{ "code": codes[2], "sequence": codes[3] }})
            peelDispatch({type:"changeStatus", payload:{"stage": codes[0], "dmCode": codes[2], field: "isValidate", "value": true}})
        } else {
            peelDispatch({type:"setActiveSample", payload:null})
            peelDispatch({type:"changeStatus", payload:{"stage": codes[0], "dmCode": codes[2], field: "isValidate", "value": false}})
        }
    }

    const handlePassSample = (_: React.SyntheticEvent | null, newValue: string | number | null, stage: number, code: string | null) => {
        if (code == null || newValue == null || peelState.isComplete) return
        peelDispatch({type:"changeStatus", payload:{"stage": stage, "dmCode": code, field: "isPass", "value": newValue == 1 ? true : false}})
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
                                            <Box display={'flex'} alignItems={'center'} gap={'10px'} sx={{my:1, pl:1, background: sample.isUse ? (peelState.activeSample != null && sample.dmCode == peelState.activeSample['code'] ? 'lime' : 'initial') : 'gray'}}>
                                                <Checkbox color="primary" disabled={peelState.isRegistered} checked={sample.isUse} inputProps={{ 'aria-label': 'controlled' }} onClick={(e) => handleCheckSample(e.target, String(stage), sample.dmCode, sample.sequence)}></Checkbox>
                                                <Typography sx={{mx:2}}>{`${sample.dmLot} - ${sample.sequence}`}</Typography>
                                                <InputDialog code={`${stage}/${String(sample.dmLot)}/${String(sample.dmCode)}/${String(sample.sequence)}`} onChanged={handleValidateSample} sx={{flex:1}} isDisabled={!sample.isUse || peelState.isRegistered}>
                                                </InputDialog>
                                                <Box sx={{ height: '36px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid lightgray', minWidth: '100px' }}>{sample.isValidate ? `照合OK` : `未照合`}</Box>
                                                {!peelState.isRequest || peelState.isComplete ? sample.isUse && sample.isValidate ?
                                                <Tabs aria-label="Basic tabs" value={sample.isPass ? 1 : 0} tabIndex={-1} onChange={(e, newValue) => { handlePassSample(e,  newValue, stage, sample.dmCode) }}>
                                                    <TabList disableUnderline>
                                                        <Tab sx={{ width: '100%' }} color={"danger"} tabIndex={-1} >NG</Tab>
                                                        <Tab sx={{ width: '100%' }} color={"success"} tabIndex={-1} >OK</Tab>
                                                    </TabList>
                                                </Tabs> : null : null}
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