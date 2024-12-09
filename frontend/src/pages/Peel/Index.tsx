import { ReactNode, useContext, useEffect, useReducer, useState } from 'react'
import { Alert, Box, Grid } from "@mui/material"
import Form from "./Form"
import Selection from "./Selection"
import Ring from "./Ring"
import { Submit } from "./Submit"
import { PeelContext, PeelInitialState, PeelReducer } from '../../store/peel'
import { AppContext } from '../../store/app'
import { graphqlMutation, graphqlQuery } from '../../middleware/request'
import { MUTATION_RESULT, QUERY_SEARCH_RESULT, QUERY_SEARCH_REQUEST } from '../../gql/query'
import { Loading } from '../../components/Loading'
import { DEMO_PEEL_SAMPLE } from '../../demo'
import { SubmitButton } from './SubmitButton'

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
    setAlert({ visible: false, type: "", message: "" })
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
        if (result.data.searchInspectionSampleRequest != null) {
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
    if (peelState.pickUpPeelSamples) {
      if (!peelState.pickUpPeelSamples.map((v:any) => v.lots.filter((w:any) => !w.isValidate && w.isUse).length).every((num:number) => num == 0)) {
        setAlert({ visible: true, type: "error", message: "照合未完了のリングがあります。" })
        peelDispatch({type: "setLoading", payload: false})
        return
      }
      if (!peelState.pickUpPeelSamples.map((v:any) => v.lots.filter((w:any) => w.isValidate && w.isUse).length).every((num:number) => num > 0)) {
        setAlert({ visible: true, type: "error", message: "すべての段のリングが選択されていません。" })
        peelDispatch({type: "setLoading", payload: false})
        return
      }
    }
    peelDispatch({type: "setLoading", payload: true})
    graphqlMutation(MUTATION_RESULT, {
      "input": {
        "lot": peelState.lot,
        "crossSectionSamples": [],
        "peelSamples": peelState.pickUpPeelSamples,
        "stages": peelState.stages,
      },
      isComplete: false
    },
    () => {
      setAlert({ visible: false, type: "", message: "" })
      peelDispatch({type: "clear"})
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

  const mutationPeelResult = (callback?:() => void) => {
    peelDispatch({type: "setLoading", payload: true})
    graphqlMutation(MUTATION_RESULT, {
      "input": {
        "lot": peelState.lot,
        "crossSectionSamples": [],
        "peelSamples": peelState.pickUpPeelSamples,
        "stages": peelState.stages,
      },
      isComplete: true
    },
    () => {
      setAlert({ visible: false, type: "", message: "" })
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
console.log(peelState)
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
      <Submit>
        <Grid container spacing={2} direction="row"
          sx={{
          marginTop: '-2px',
          justifyContent: "center",
          alignItems: "flex-start",
        }}>
          <Grid item xs={3}>
          </Grid>
          <Grid item xs={3}>
            {peelState.lot != null ?
            <SubmitButton submitLabel={peelState.isRequest == null || peelState.isRequest ? '照合登録' : '照合登録済'} submitDisable={peelState.isRequest != null && !peelState.isRequest}
              handleSubmit={mutationPeel}
            />
            :null}
          </Grid>
          <Grid item xs={3}>
            {peelState.lot != null ?
              peelState.isRequest != null && !peelState.isRequest && peelState.isComplete != null ?
              <SubmitButton submitLabel={!peelState.isComplete ? '実績登録' : '実績登録済'} submitDisable={peelState.isComplete} 
                handleSubmit={mutationPeelResult}
              
              />
              :null
            :null}
          </Grid>
          <Grid item xs={3}>
          </Grid>
        </Grid>
      </Submit>
      {peelState.isLoading ? <Loading /> : null}
    </Box>
  )
}
export default Index