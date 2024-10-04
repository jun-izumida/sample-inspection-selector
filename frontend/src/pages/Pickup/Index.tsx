import { Alert, Box } from "@mui/material"
import Form from "./Form"
import Info from "./Info"
import Selection from "./Selection"
import QRCodeDialog from "./QRCodeDialog"
import { PICKUP_RESULT_PROCESS_CODE, WEBAPPLICATION_API_ENDPOINT, WEBAPPLICATION_API_URL_EPR } from "../../Settings"
import { useEffect, useState } from "react"
import { graphqlQuery } from "../../middleware/request"
import { QUERY_SEARCH_LOT } from "../../gql/query"
import SampleRings from "./SampleRings"

// JAM-DEVELOP経由で取得
// sudo mount -t cifs -o ro,user=agel,password= "//10.204.143.83/Data/Result" /mnt   
const rst_demo = [
  '/mnt/CT2A_07J4921-10rst.csv', '/mnt/CT2A_07J4921-15rst.csv', '/mnt/CT2A_07J4921-1rst.csv', '/mnt/CT2A_07J4921-24rst.csv', '/mnt/CT2A_07J4921-3rst.csv',  
  '/mnt/CT2A_07J4921-8rst.csv', '/mnt/CT2A_07J4921-11rst.csv', '/mnt/CT2A_07J4921-16rst.csv', '/mnt/CT2A_07J4921-20rst.csv', '/mnt/CT2A_07J4921-25rst.csv',
  '/mnt/CT2A_07J4921-4rst.csv', '/mnt/CT2A_07J4921-9rst.csv', '/mnt/CT2A_07J4921-12rst.csv', '/mnt/CT2A_07J4921-17rst.csv', '/mnt/CT2A_07J4921-21rst.csv',
  '/mnt/CT2A_07J4921-26rst.csv', '/mnt/CT2A_07J4921-5rst.csv', '/mnt/CT2A_07J4921-13rst.csv', '/mnt/CT2A_07J4921-18rst.csv', '/mnt/CT2A_07J4921-22rst.csv',
  '/mnt/CT2A_07J4921-27rst.csv', '/mnt/CT2A_07J4921-6rst.csv', '/mnt/CT2A_07J4921-14rst.csv', '/mnt/CT2A_07J4921-19rst.csv', '/mnt/CT2A_07J4921-23rst.csv',
  '/mnt/CT2A_07J4921-2rst.csv',  '/mnt/CT2A_07J4921-7rst.csv'
]

const rst_demo2 = [
  "CV4B_30N4918-10rst.csv",
"CV4B_30N4918-11rst.csv",
"CV4B_30N4918-12rst.csv",
"CV4B_30N4918-13rst.csv",
"CV4B_30N4918-14rst.csv",
"CV4B_30N4918-15rst.csv",
"CV4B_30N4918-16rst.csv",
"CV4B_30N4918-17rst.csv",
"CV4B_30N4918-18rst.csv",
"CV4B_30N4918-19rst.csv",
"CV4B_30N4918-1rst.csv",
"CV4B_30N4918-20rst.csv",
"CV4B_30N4918-21rst.csv",
"CV4B_30N4918-22rst.csv",
"CV4B_30N4918-23rst.csv",
"CV4B_30N4918-24rst.csv",
"CV4B_30N4918-25rst.csv",
"CV4B_30N4918-26rst.csv",
"CV4B_30N4918-27rst.csv",
"CV4B_30N4918-28rst.csv",
"CV4B_30N4918-29rst.csv",
"CV4B_30N4918-2rst.csv",
"CV4B_30N4918-30rst.csv",
"CV4B_30N4918-31rst.csv",
"CV4B_30N4918-32rst.csv",
"CV4B_30N4918-33rst.csv",
"CV4B_30N4918-34rst.csv",
"CV4B_30N4918-35rst.csv",
"CV4B_30N4918-36rst.csv",
"CV4B_30N4918-37rst.csv",
"CV4B_30N4918-38rst.csv",
"CV4B_30N4918-39rst.csv",
"CV4B_30N4918-3rst.csv",
"CV4B_30N4918-4rst.csv",
"CV4B_30N4918-5rst.csv",
"CV4B_30N4918-6rst.csv",
"CV4B_30N4918-7rst.csv",
"CV4B_30N4918-8rst.csv",
"CV4B_30N4918-9rst.csv",

]

const Index = () => {
  const [operationResult, setOpreationResult] = useState<any>(null)
  const [rstFiles, setRstFiles] = useState<string[]>([])
  const [isSearched, setIsSearched] = useState<boolean>(false)
  const [pickups, setPickups] = useState<{[key: string]: any}>([])

  const search_result = (searchText: string) => {
    graphqlQuery(QUERY_SEARCH_LOT, { lot: searchText },
      () => {
        //appDispatch({ type: "setLoading", payload: false})
      },
      (result: any) => {
        console.log(result)
        pickup_peel(result.data.searchLot.stages, result.data.searchLot.trace, search_rst(rst_demo2))
        /*
        if (result.data.tokenAuthenticate != null && result.data.tokenAuthenticate.account != null) {
          appDispatch({ type: "setAccount", payload: result.data.tokenAuthenticate.account })
          if (result.data.tokenAuthenticate.account.isUpdateCoin) {
              notifications.show({
                style: {backgroundColor: '#ff33ff66', color: 'white'},
                color: 'white',
                title: 'ログインボーナス',
                message: <Flex><Image style={{height: '24px', width: '24px'}} src={`${import.meta.env.VITE_APP_ASSET_BASE}/manabit_coin.png`} /><Box style={{color: 'black', fontWeight: 'bold'}}>まなびっとコインをゲットしました。</Box></Flex>,
              })
          }
        }
          */
      },
      (error: any) => {
        console.log(error)
      }
    )

    /*
    fetch(`${WEBAPPLICATION_API_ENDPOINT}${WEBAPPLICATION_API_URL_EPR}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lot: searchText
      })
    })
      .then(response => response.json())
      .then(data => {
        setIsSearched(true)
        const result = data.data.filter((v: any) => {
          return v.proccd == PICKUP_RESULT_PROCESS_CODE
        })
        if (result.length == 0) {
          return
        }
        setOpreationResult(result[0])
        setRstFiles(rst_demo)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      */
  }

  const search_rst = (v:string[]) => {
    return v.map((v) => v.replace(/(?:\/mnt\/)?(.*?)-(\d+).*\.csv$/, "$1-$2"))
  }

  const pickup_peel = (stages:number[], dm:any[], rst:string[]) => {
    const temp_pickups: { [key: string]: any } = {}
    stages.forEach(stage => {
      temp_pickups[`stage-${stage}`] = []
      const items = dm.filter((v:any) => v.dmStage == stage && rst.includes(v.dmLot))
      Array.from({ length: 2 }).forEach(() => {
        const randomIndex = Math.floor(Math.random() * items.length);
        const randomItem = items.splice(randomIndex, 1)[0];
        temp_pickups[`stage-${stage}`].push(randomItem)
      })
      console.log(pickups)
    });
    setPickups(temp_pickups)
  }

  useEffect(() => {
  })

  return (
    <Box>
      <Form handleSearchResult={search_result} />
      {isSearched && operationResult == null ? <Alert severity="warning">対象ロットが見つかりませんでした。</Alert> : null}
      <Info lotInfo={operationResult} />
      <hr />
      <Selection />
      <hr />
      <SampleRings pickups={pickups} />
      <QRCodeDialog />
    </Box>
  )
}
export default Index