import { ReactNode, useContext, useEffect, useState, useReducer } from 'react'
import { Alert, Box } from "@mui/material"
import Form from "./Form"
import Info from "./Info"
import Selection from "./Selection"
import QRCodeDialog from "./QRCodeDialog"
import { PICKUP_RESULT_PROCESS_CODE, WEBAPPLICATION_API_ENDPOINT, WEBAPPLICATION_API_URL_EPR } from "../../Settings"
import { graphqlQuery, graphqlQueryTemp } from "../../middleware/request"
import { QUERY_SEARCH_LOT, QUERY_SEARCH_RST } from "../../gql/query"
import SampleRings from "./SampleRings"
import { PickUpContext, PickUpInitialState, PickUpReducer } from '../../store/pickup'
import { Loading } from '../../components/Loading'
import { Submit } from '../../components/Submit'
import { DEMO_SEARCH_FILES, DEMO_SEARCH_LOT } from '../../demo'

// JAM-DEVELOP経由で取得
// sudo mount -t cifs -o ro,user=agel,password= "//10.204.143.83/Data/Result" /mnt   

const PickUpAppProvider = ({ children }: { children?: ReactNode; }) => {
  const [ pickupState, pickupDispatch ] = useReducer(PickUpReducer, PickUpInitialState)
  return (
    <PickUpContext.Provider value={{pickupState, pickupDispatch}}>{children}</PickUpContext.Provider>
  )
}

const Index = () => {
  return (
    <PickUpAppProvider>
      <App />
    </PickUpAppProvider>
  )
}

type AlertType = {
  visible: boolean
  type: any
  message: string
}

const App = () => {
  const { pickupState, pickupDispatch } = useContext(PickUpContext)
  const [operationResult, setOpreationResult] = useState<any>(null)
  const [rstFiles, setRstFiles] = useState<string[]>([])
  const [isSearched, setIsSearched] = useState<boolean>(false)
  const [alert, setAlert] = useState<AlertType>({visible: false, type: "", message: ""})
  const [pickups, setPickups] = useState<{[key: string]: any}>([])
  const [frames, setFrames] = useState<{[key: string]: any}>([])

  const search_demo = () => {
    const lot = DEMO_SEARCH_LOT
    const files = DEMO_SEARCH_FILES
    const rsts = files["searchFiles"].map((v:string) => v.replace(/(?:\/mnt\/)?(.*?)-(\d+).*\.csv$/, "$1-$2"))
    console.log(rsts)
    //search_rst(result.data.searchLot.result.resourcecd, result.data.searchLot.result.lot)
    pickup_peel(lot["searchLot"].stages, lot["searchLot"].trace, rsts)
  }

  const search_result = (searchText: string) => {
    search_demo()
    return

    pickupDispatch({type: "setLoading", payload: true})
    graphqlQuery(QUERY_SEARCH_LOT, { lot: searchText },
      () => {
        pickupDispatch({type: "setLoading", payload: false})
        //appDispatch({ type: "setLoading", payload: false})
      },
      (result: any) => {
        console.log(result)
        search_rst(result.data.searchLot.result.resourcecd, result.data.searchLot.result.lot, result.data.searchLot.stages, result.data.searchLot.trace)
        //pickup_peel(result.data.searchLot.stages, result.data.searchLot.trace, search_rst(result.data.searchLot.result.coatlot))
      },
      (error: any) => {
        setAlert({visible:true, type:"error", message:error["message"]})
        console.log(error)
      }
    )
  }

  const search_rst = (resourcecd:string, lot:string, stages:number[], dm:any[]) => {
    graphqlQueryTemp(QUERY_SEARCH_RST, { machineCode: resourcecd, prefix: `${lot.substring(0, 4)}_${lot.substring(4, 11)}` },
      () => {
        //appDispatch({ type: "setLoading", payload: false})
      },
      (result: any) => {
        const files = result.data.searchFiles
        const rsts = files.map((v:string) => v.replace(/(?:\/mnt\/)?(.*?)-(\d+).*\.csv$/, "$1-$2"))
        console.log(rsts)
        //search_rst(result.data.searchLot.result.resourcecd, result.data.searchLot.result.lot)
        pickup_peel(stages, dm, rsts)
      },
      (error: any) => {
        setAlert({visible:true, type:"error", message:error["message"]})
        console.log(error)
      }
    )
    /* return v.map((v) => v.replace(/(?:\/mnt\/)?(.*?)-(\d+).*\.csv$/, "$1-$2"))*/
  }

  const pickup_peel = (stages:number[], dm:any[], rst:string[]) => {
    const picked: string[] = []
    const temp_pickups: { [key: string]: any } = {}
    stages.forEach(stage => {
      temp_pickups[`stage-${stage}`] = []
      const items = dm.filter((v:any) => v.dmStage == String(stage) && rst.includes(v.dmLot) && !picked.includes(v.dmLot))
      Array.from({ length: ( items.length > 2 ? 2 : items.length ) }).forEach(() => {
        const randomIndex = Math.floor(Math.random() * items.length);
        const randomItem = items.splice(randomIndex, 1)[0];
        picked.push(randomItem.dmLot)
        temp_pickups[`stage-${stage}`].push(randomItem)
      })
    });
    const remain = [...new Set(dm.filter((v:any) => rst.includes(v.dmLot) && !picked.includes(v.dmLot)).map((w:any) => w.dmLot))]
    const sample = [remain[0], remain[parseInt(remain.length / 2)], remain[remain.length - 1]]
    console.log(sample)

    pickupDispatch({type:"setPickUpItem", payload: sample.map((v:string, i:number) => {
      return {
        sequence: i,
        selectItem: v,
        validateItem: null
      }
    })})
    pickupDispatch({type:"setPickUpPeelSamples", payload: temp_pickups})
  }

  const mutationPickup = (callback?:() => void) => {
    if (callback != undefined) {
      callback()
    }
  }

  useEffect(() => {
  }, [])

  return (
    <>
      <Box>
        <Form handleSearchResult={search_result} />
        {alert.visible ? <Alert severity={alert.type}>{alert.message}</Alert> : null}
        {isSearched && operationResult == null ? <Alert severity="warning">対象ロットが見つかりませんでした。</Alert> : null}
        <Info lotInfo={operationResult} />
        <hr />
        <Selection />
        <hr />
        <SampleRings />
        <QRCodeDialog />
      </Box>
      <Submit handleSubmit={mutationPickup} />
      {pickupState.isLoading ? <Loading /> : null}
    </>
  )
}
export default Index