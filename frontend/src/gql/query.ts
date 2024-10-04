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

