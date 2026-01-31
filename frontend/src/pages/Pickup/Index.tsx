import { ReactNode, useContext, useEffect, useState, useReducer } from 'react'
import { Alert, Box, Button, Grid } from "@mui/material"
import Form from "./Form"
import Info from "./Info"
import Selection from "./Selection"
import QRCodeDialog from "./QRCodeDialog"
import { graphqlMutation, graphqlQuery, graphqlQueryTemp } from "../../middleware/request"
import { MUTATION_REQUEST, QUERY_SEARCH_LOT, QUERY_SEARCH_RST, QUERY_SEARCH_REQUEST } from "../../gql/query"
import SampleRings from "./SampleRings"
import { PickUpContext, PickUpInitialState, PickUpReducer } from '../../store/pickup'
import { Loading } from '../../components/Loading'
import { Submit } from './Submit'
//import { DEMO_SEARCH_FILES, DEMO_SEARCH_LOT } from '../../demo'
import { AppContext } from '../../store/app'

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
      <PickUpApp />
    </PickUpAppProvider>
  )
}

type AlertType = {
  visible: boolean
  type: any
  message: string
}

const PickUpApp = () => {
  const { appDispatch } = useContext(AppContext)
  const { pickupState, pickupDispatch } = useContext(PickUpContext)
  const [operationResult ] = useState<any>(null)
  const [isSearched] = useState<boolean>(false)
  const [alert, setAlert] = useState<AlertType>({visible: false, type: "", message: ""})
  /*
  const search_demo = () => {
    const lot = DEMO_SEARCH_LOT
    const files = DEMO_SEARCH_FILES
    const rsts = files["searchFiles"].map((v:string) => v.replace(/(?:\/mnt\/)?(.*?)-(\d+).*\.csv$/, "$1-$2"))
    pickupDispatch({type:"setResult", payload: lot["searchLot"].result})
    pickup_peel(lot["searchLot"].stages, lot["searchLot"].trace, rsts)
    pickupDispatch({type: "setLoading", payload: false})
  }
  */

  const search = (searchText: string) => {
          //search_demo()
          //return
    setAlert({visible:false, type:"error", message:``})
    pickupDispatch({type:"clear"})
    pickupDispatch({type:"setLoading", payload: true})

    graphqlQuery(QUERY_SEARCH_LOT, { lot: searchText.replace("_", "") },
      () => {
      },
      (result: any) => {
        if (result.data.searchLot.result != null) {
          pickupDispatch({type:"setResult", payload: result.data.searchLot.result})
          search_samples(result.data.searchLot.result, result.data.searchLot.stages, result.data.searchLot.trace)
        } else {
          pickupDispatch({type: "setLoading", payload: false})
          setAlert({visible:true, type:"warning", message:`見つかりません。`})
        }
      },
      (error: any) => {
        pickupDispatch({type: "setLoading", payload: false})
        setAlert({visible:true, type:"error", message:`[実績検索]: ${error["message"]}`})
      }
    )

  }

  const search_samples = (search_result:any, search_stages:any, search_trace:any) => {
    graphqlQuery(QUERY_SEARCH_REQUEST, { lot: search_result.lot },
      () => {
      },
      (result: any) => {
        if (result.data.searchInspectionSampleRequest != null) {
          pickupDispatch({type:"setSearchSamples", payload: result.data.searchInspectionSampleRequest})
          pickupDispatch({type: "setLoading", payload: false})
        } else {
          /******/
          /* search_demo() */
          /******/
          search_rst(search_result.resourcecd, search_result.lot, search_stages, search_trace)
        }
      },  
      (error: any) => {
        pickupDispatch({type: "setLoading", payload: false})
        setAlert({visible:true, type:"error", message:`[検索]: ${error["message"]}`})
      }
    )
  }

  const search_rst = (resourcecd:string, lot:string, stages:number[], dm:any[]) => {
    graphqlQueryTemp(QUERY_SEARCH_RST, { machineCode: resourcecd, prefix: `${lot.substring(0, 4)}_${lot.substring(4, 11)}` },
      () => {
        pickupDispatch({type: "setLoading", payload: false})
      },
      (result: any) => {
        const files = result.data.searchFiles
        const rsts = files.map((v:string) => v.replace(/(?:\/mnt\/)?(.*?)-(\d+).*\.csv$/, "$1-$2")).sort()
        pickup_peel(stages, dm, rsts)
      },
      (error: any) => {
        pickupDispatch({type: "setLoading", payload: false})
        setAlert({visible:true, type:"error", message:`[RST検索]: ${error["message"]}`})
      }
    )
  }

  const pickup_peel = (stages:number[], dm:any[], rst:string[]) => {
    const picked: string[] = []
    const temp_pickups: { [key: string]: any } = {}
    
    pickupDispatch({type: "setStages", payload: stages})
    const rings = dm.filter((v:any) => rst.includes(v.dmLot) && !picked.includes(v.dmLot))
    const stage_count = (stages.map((v:number) => { return {stage: v, count: rings.filter((w:any) => w.dmStage == String(v)).length}})).sort((a:any, b:any) => a.count - b.count);

    stage_count.forEach(row => {
      temp_pickups[`${String(row.stage)}`] = []
      const items = rings.filter((v:any) => v.dmStage == String(row.stage) && rst.includes(v.dmLot) && !picked.includes(v.dmLot))

      Array.from({ length: ( items.length > 2 ? 2 : items.length ) }).forEach(() => {
        var randomIndex = Math.floor(Math.random() * items.length);
        var randomItem = items.splice(randomIndex, 1)[0];
        while (picked.includes(randomItem.dmLot)) {
          randomItem = items.splice(Math.floor(Math.random() * items.length), 1)[0];
        }
        picked.push(randomItem.dmLot)
        temp_pickups[`${String(row.stage)}`].push(randomItem)
      })

    });

    const remain = [...new Set(rings.filter((v:any) => rst.includes(v.dmLot) && !picked.includes(v.dmLot)).map((w:any) => w.dmLot))]
    const sample = [remain[0], remain[Math.floor(remain.length / 2)], remain[remain.length - 1]]

    pickupDispatch({type:"setStageCount", payload: stage_count})
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
    pickupDispatch({type: "setLoading", payload: true})
    graphqlMutation(MUTATION_REQUEST, {
      "input": {
        "lot": pickupState.result.lot,
        "crossSectionSamples": pickupState.pickUpItem != null ? pickupState.pickUpItem.map((v:any) => { return {"lot": v.selectItem} }) : [],
        "peelSamples": (pickupState.pickUpPeelSamples != null ? Object.keys(pickupState.pickUpPeelSamples).map((k:string) => { 
          return {
            "stage": k, 
            "lots": pickupState.pickUpPeelSamples != null ? pickupState.pickUpPeelSamples[k].map((v:any) => {
              return {
                "dmCode": v.dmCode,
                "dmLot": v.dmLot,
                "dmStage": v.dmStage,
                "dmSuffix": v.dmSuffix,
                "ring": v.ring,
                "sequence": v.sequence
              }
            }) : []
          }
        }) : []),
        "stages": pickupState.stages
      }
    },
    () => {
      pickupDispatch({type: "setLoading", payload: false})
    },
    (response:any) => {
      console.log(response)
      pickupDispatch({type: "clear"})
      pickupDispatch({type: "resetTimestamp"})
    },
    (error:any) => {
      console.log(error)
    }) 
    if (callback != undefined) {
      callback()
    }
  }

  useEffect(() => {
    appDispatch({type: "setTitle", payload: "リング選定"})
  }, [])

  return (
    <Box sx={{width: '100%', height: '100%', mb: '82px'}}>
      <Box>
        <Form handleSearchResult={search} />
        {alert.visible ? <Alert severity={alert.type}>{alert.message}</Alert> : null}
        {isSearched && operationResult == null ? <Alert severity="warning">対象ロットが見つかりませんでした。</Alert> : null}
        <Info />
        <hr />
        {/*<!-- <Selection /> -->*/}
        <hr />
        <SampleRings />
      </Box>
      { /*pickupState.pickUpItem.filter((v:any) => v.selectItem != "" && v.selectItem == v.validateItem).length >= 3*/
      pickupState.pickUpItem != null && pickupState.pickUpItem.length > 0 && pickupState.pickUpPeelSamples != null && Object.keys(pickupState.pickUpPeelSamples).length > 0 ?
      <Submit handleSubmit={mutationPickup}>
        {pickupState.isRegistered ? 
        <Box sx={{height: '100%', width: '100%'}}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Button variant="contained" sx={{position: 'absolute', top: '50%', left: '10px', transform: 'translate(0%, -50%)'}}>編集</Button>
            </Grid>
            <Grid item xs={4} sx={{textAlign: 'center', verticalAlign: 'middle', top: '50%', transform: 'translate(0%, 30%)'}}>
              <Button className="submit" variant="contained" disabled sx={{backgroundColor: 'initial !important', color: 'white !important'}}>登録済み</Button>
            </Grid>
            <Grid item xs={4}>
              <QRCodeDialog sx={{position: 'absolute', top: '50%', right: '10px', transform: 'translate(0%, -50%)'}} values={pickupState.pickUpItem.map((v:any) => v.selectItem)} />
            </Grid>

          </Grid>
        </Box>
         : null}
      </Submit>
      : null}
      {pickupState.isLoading ? <Loading /> : null}
    </Box>
  )
}
export default Index