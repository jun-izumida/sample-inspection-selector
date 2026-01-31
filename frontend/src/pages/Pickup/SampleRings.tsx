import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, CardHeader, Grid, List, ListItem, ListItemText } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContext, useEffect } from "react";
import { PickUpContext } from "../../store/pickup";

interface SampleRingsType {
}

const SampleRings = ({ }: SampleRingsType) => {
    const { pickupState } = useContext(PickUpContext)
    useEffect(() => {
    }, [])
    return (
        <Accordion sx={{ mx: 1 }} defaultExpanded={true}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="peel-panel-content"
                id="peel-panel-header"
            >
                ピール用サンプルリング
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    {pickupState.stages != null ? pickupState.stages.map((v: any, i: number) => {
                        console.log(pickupState.stageCount)
                        const stage_count = pickupState.stageCount != null ? pickupState.stageCount.filter((s:any) => String(s.stage) == v)[0] : null
                        return (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Card>
                                    {stage_count != null ?
                                    <CardHeader sx={{py:1, background: 'lightblue'}} title={`${v} : [ 枚数: ${stage_count.count} ]`} />
                                    :
                                    <CardHeader sx={{py:1, background: 'lightblue'}} title={`${v}`} />
                                    }

                                    <CardContent sx={{ m: 0, p: "0 !important", minHeight: '112px' }}>
                                        <List>
                                            {pickupState.pickUpPeelSamples != null && pickupState.pickUpPeelSamples[v] != null ? pickupState.pickUpPeelSamples[v].map((p: any, i: number) => {
                                                return (
                                                    <ListItem key={i}>
                                                        <ListItemText primary={p.dmLot} />
                                                    </ListItem>
                                                )
                                            }) : null}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    }) : null}
                </Grid>
            </AccordionDetails>
        </Accordion>
    )
}
export default SampleRings