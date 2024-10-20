import { Box, Button, TextField, Typography } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { Tab, TabList, Tabs } from "@mui/joy";
import { InputDialog } from "../../components/InputDialog";
import { useContext, useEffect } from "react";
import { PickUpContext, PickUpItemType } from "../../store/pickup";

const demo:PickUpItemType[] = [
    {sequence:2, selectItem: "ABC", validateItem:null},
    {sequence:1, selectItem: "DEF", validateItem:null}, 
    {sequence:3, selectItem: "GHI", validateItem:null} 
]

const Selection = () => {
    const { pickupState, pickupDispatch } = useContext(PickUpContext)

    const onChanged = (code: string | null, value: string) => {
        if (code != null) {
            console.log(pickupState.pickUpItem)
            console.log(code)
            const work:PickUpItemType[] = pickupState.pickUpItem.filter((v:PickUpItemType) => parseInt(code) == v.sequence)
            console.log(work)
            work[0].validateItem = value
            pickupDispatch({type: "updatePickUpItem", payload: work[0]})
        }

    }

    useEffect(() => {
        pickupDispatch({type:"setPickUpItem", payload:demo})
    }, [])

    return (
        <Box>
            {(pickupState.pickUpItem.length > 0 ? pickupState.pickUpItem : []).sort((a:PickUpItemType , b:PickUpItemType) => a.sequence - b.sequence).map((v:PickUpItemType, i:number) => {
                return (
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1}, display: 'flex', alignItems: 'center'}}
                noValidate
                autoComplete="off"
                key={i}
            >
                <Box sx={{display: 'flex', flex:1}}>
                    <TextField label="フレーム" variant="outlined" sx={{ mr:1, flex: 1 }} size="small" focused value={v.selectItem} />
                    <InputDialog code={String(v.sequence)} onChanged={onChanged} sx={{flex:1}}>
                        <TextField label="リングQR" variant="outlined" fullWidth size="small" inputProps={{ readOnly: true }} focused value={v.validateItem} />
                    </InputDialog>
                </Box>
                <Box sx={{width:'25ch'}}>
                <Tabs aria-label="Basic tabs" value={v.selectItem == v.validateItem ? 1 : 0} tabIndex={-1}>
                    <TabList disableUnderline>
                        <Tab sx={{ width: '100%' }} color={"danger"} tabIndex={-1}>NG</Tab>
                        <Tab sx={{ width: '100%' }} color={"success"} tabIndex={-1}>OK</Tab>
                    </TabList>
                </Tabs>
                </Box>
            </Box>
                )
            })}
        </Box>
    )
}
export default Selection