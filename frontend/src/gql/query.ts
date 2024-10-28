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

export const QUERY_SEARCH_SAMPLES = gql`
    query ($lot: String!) {
        searchSamples(lot: $lot) {
            lot
            stages
            crossSectionSamples {
                lot
            }
            peelSamples {
                stage
                lots {
                    dmCode
                    dmLot
                    dmStage
                    dmSuffix
                    ring
                    sequence
                }
            }
        }
    }
`

export const MUTATION_PICKUP = gql`
    mutation ($input: InspectionSampleInput!) {
        updateInspectionSampleLots(input:$input)
    }
`