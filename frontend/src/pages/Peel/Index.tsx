import { ReactNode, useContext, useEffect, useReducer } from 'react'
import { Box, Grid } from "@mui/material"
import Form from "./Form"
import Info from "./Info"
import Selection from "./Selection"
import { QRCodeSVG } from "qrcode.react"
import QRCodeDialog from "./QRCodeDialog"
import Ring from "./Ring"
import { Submit } from "../../components/Submit"
import { PeelContext, PeelInitialState, PeelReducer } from '../../store/peel'
import { AppContext } from '../../store/app'
import { graphqlQuery } from '../../middleware/request'
import { QUERY_SEARCH_SAMPLES } from '../../gql/query'

export const DEMO_FRAME = [
  ["frame-1-block3", "frame-13-block3"],
  ["frame-3-block1", "frame-24-block4"],
  ["frame-4-block2", "frame-10-block3"],
  ["frame-1-block1", "frame-4-block4"],
  ["frame-4-block4", "frame-1-block1"],
]

const PeelAppProvider = ({ children }: { children?: ReactNode; }) => {
  const [ peelState, peelDispatch ] = useReducer(PeelReducer, PeelInitialState)
  return (
    <PeelContext.Provider value={{peelState, peelDispatch}}>{children}</PeelContext.Provider>
  )
}

const Index = () => {
  return (
    <PeelAppProvider>
      <PeelApp />
    </PeelAppProvider>
  )
}

const PeelApp = () => {
  const { appState, appDispatch } = useContext(AppContext)
  const { peelState, peelDispatch } = useContext(PeelContext)

  const search_samples = (search_text:any) => {
    peelDispatch({type:"clear"})
    graphqlQuery(QUERY_SEARCH_SAMPLES, { lot: search_text },
      () => {
      },
      (result: any) => {
        if (result.data.searchSamples != null) {
          peelDispatch({type:"setStages", payload: result.data.searchSamples.stages})
          peelDispatch({type:"setPickUpPeelSamples", payload: result.data.searchSamples.peelSamples})
          /*
          pickupDispatch({type:"setSearchSamples", payload: result.data.searchSamples})
          pickupDispatch({type: "setLoading", payload: false})
          */
        } else {
          //search_demo()
          //search_rst(result.result.resourcecd, result.result.lot, result.stages, result.trace)
        }
      },  
      (error: any) => {
        /*
        pickupDispatch({type: "setLoading", payload: false})
        setAlert({visible:true, type:"error", message:`[検索]: ${error["message"]}`})
        */
      }
    )
  }

  useEffect(() => {
    appDispatch({type: "setTitle", payload: "Pickup"})

    //peelDispatch({type: "SetStairs", payload: DEMO_FRAME})
  }, [])

  return (
      <Box sx={{position: 'relative'}}>
        <Form handleSearchResult={search_samples} />
        <hr />
        <Grid container sx={{mt:4, minHeight: '300px'}}>
          <Grid item xs={8} position={"relative"}>
            <Selection />
          </Grid>
          <Grid item xs={4} position={"relative"}>
            <Ring />
          </Grid>
        </Grid>
        <Submit />
      </Box>
  )
}
export default Index