import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, List, ListItem, ListItemText, TextField, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { Tab, TabList, Tabs } from "@mui/joy";

interface SampleRingsType {
    pickups: {[key: string]: any}
}

const SampleRings = ({pickups}:SampleRingsType) => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="peel-panel-content"
                id="peel-panel-header"
            >
                ピール用サンプルリング
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                {Object.keys(pickups).map((v:any, i:number) => {
                    return (
                        <Grid item xs={12} md={4}>
                        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                            {v}
                        </Typography>
                        <List>
                            {pickups[v].map((p:any, i:number) => {
                                return (
                                 <ListItem key={i}>
                                    <ListItemText primary={p.dmLot} />
                                </ListItem>
                            )
                            })
                        }
                        </List>
                    </Grid>
                    )
                    })}
                </Grid>
            </AccordionDetails>

      </Accordion>
    )
}
export default SampleRings