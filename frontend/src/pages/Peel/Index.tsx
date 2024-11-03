import { ReactNode, useContext, useEffect, useReducer, useState } from 'react'
import { Alert, Box, Button, Grid } from "@mui/material"
import Form from "./Form"
import Selection from "./Selection"
import Ring from "./Ring"
import { Submit } from "../../components/Submit"
import { PeelContext, PeelInitialState, PeelReducer } from '../../store/peel'
import { AppContext } from '../../store/app'
import { graphqlMutation, graphqlQuery } from '../../middleware/request'
import { MUTATION_RESULT, QUERY_SEARCH_RESULT, QUERY_SEARCH_REQUEST } from '../../gql/query'
import { Loading } from '../../components/Loading'
import { DEMO_PEEL_SAMPLE } from '../../demo'

export const DEMO_FRAME = [
  ["frame-1-block3", "frame-13-block3"],
  ["frame-3-block1", "frame-24-block4"],
  ["frame-4-block2", "frame-10-block3"],
  ["frame-1-block1", "frame-4-block4"],
  ["frame-4-block4", "frame-1-block1"],
]

type AlertType = {
  visible: boolean
  type: any
  message: string
}

const PeelAppProvider = ({ children }: { children?: ReactNode; }) => {
  const [peelState, peelDispatch] = useReducer(PeelReducer, PeelInitialState)
  return (
    <PeelContext.Provider value={{ peelState, peelDispatch }}>{children}</PeelContext.Provider>
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
  const { appDispatch } = useContext(AppContext)
  const { peelState, peelDispatch } = useContext(PeelContext)
  const [alert, setAlert] = useState<AlertType>({ visible: false, type: "", message: "" })

  const search_result = (search_text: any) => {
    peelDispatch({ type: "clear" })
    peelDispatch({ type: "setLoading", payload: true })
    graphqlQuery(QUERY_SEARCH_RESULT, { lot: search_text },
      () => {
      },
      (result: any) => {
        if (result.data.searchInspectionSampleResult != null) {
          peelDispatch({ type: "setSampleRequest", payload: result.data.searchInspectionSampleResult })
          peelDispatch({ type: "setLoading", payload: false })
          peelDispatch({ type: "setRegistered", payload: true })
        } else {
          search_request(search_text)
          //search_rst(result.result.resourcecd, result.result.lot, result.stages, result.trace)
        }
      },
      (error: any) => {
        setAlert({ visible: true, type: "error", message: `[検索]: ${error["message"]}` })
        return
      }
    )
  }

  const search_request = (search_text: any) => {
    graphqlQuery(QUERY_SEARCH_REQUEST, { lot: search_text },
      () => {
        peelDispatch({ type: "setLoading", payload: false })
      },
      (result: any) => {
        if (result.data.searchSamples != null) {
          peelDispatch({ type: "setSampleRequest", payload: result.data.searchInspectionSampleRequest })
        } else {
          //peelDispatch({ type: "setSampleRequest", payload: DEMO_PEEL_SAMPLE.searchSamples })
          setAlert({ visible: true, type: "warning", message: `[検索]: 見つかりません` })
        }
      },
      (error: any) => {
        setAlert({ visible: true, type: "error", message: `[検索]: ${error["message"]}` })
        peelDispatch({ type: "setSampleRequest", payload: DEMO_PEEL_SAMPLE.searchSamples })

      }
    )
  }

  const mutationPeel = (callback?:() => void) => {
    peelDispatch({type: "setLoading", payload: true})
    graphqlMutation(MUTATION_RESULT, {
      "input": {
        "lot": peelState.lot,
        "crossSectionSamples": [],
        "peelSamples": peelState.pickUpPeelSamples,
        "stages": peelState.stages
      }
    },
    () => {
      peelDispatch({type: "setLoading", payload: false})
    },
    (response:any) => {
      console.log(response)
      peelDispatch({type: "clear"})
      peelDispatch({type: "resetTimestamp"})
    },
    (error:any) => {
      console.log(error)
    }) 
    if (callback != undefined) {
      callback()
    }
  }

  useEffect(() => {
    appDispatch({ type: "setTitle", payload: "ピール" })
  }, [])

  return (
    <Box sx={{ position: 'relative', minWidth: '1000px', mb: '82px' }}>
      <Form handleSearchResult={search_result} />
      {alert.visible ? <Alert severity={alert.type}>{alert.message}</Alert> : null}
      <hr />
      <Grid container sx={{ mt: 4, minHeight: '300px' }}>
        <Grid item xs={8} position={"relative"}>
          <Selection />
        </Grid>
        <Grid item xs={4} position={"relative"}>
          <Ring />
        </Grid>
      </Grid>
      <Submit handleSubmit={mutationPeel}>
        {peelState.isRegistered ? 
        <Box sx={{height: '100%', width: '100%'}}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
            </Grid>
            <Grid item xs={4}>
              <Button className="submit" variant="contained" disabled sx={{backgroundColor: 'initial !important', color: 'white !important'}}>登録済み</Button>
            </Grid>
            <Grid item xs={4}>
            </Grid>
          </Grid>
        </Box>
         : null}
      </Submit>
      {peelState.isLoading ? <Loading /> : null}
    </Box>
  )
}
export default Index