import { gql } from '@apollo/client';

export const QUERY_SEARCH_LOT = gql`
    query ($lot:String!) {
        searchLot(lot:$lot) {
            result {
                ymd
                product
                lot
                coatlot
                resourcecd
                resname
            }
            trace {
                ring
                dmLot
                dmCode
                dmStage
                dmSuffix
                sequence
            }
            stages
        }
    }
`

export const QUERY_SEARCH_RST = gql`
    query ($machineCode:String!, $prefix:String!) {
        searchFiles(machineCode:$machineCode, prefix:$prefix)
    }
`
