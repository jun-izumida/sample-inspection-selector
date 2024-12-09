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

export const QUERY_SEARCH_REQUEST = gql`
    query ($lot: String!) {
        searchInspectionSampleRequest(lot: $lot) {
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
            isRequest
            isComplete
        }
    }
`
export const QUERY_SEARCH_RESULT = gql`
    query ($lot: String!) {
        searchInspectionSampleResult(lot: $lot) {
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
                    isUse
                    isValidate
                    isPass
                }
            }
            isRequest
            isComplete
        }
    }
`

export const MUTATION_REQUEST = gql`
    mutation ($input: InspectionSampleInput!) {
        updateInspectionSampleRequest(input:$input)
    }
`

export const MUTATION_RESULT = gql`
    mutation ($input: InspectionSampleInput!, $isComplete:Boolean) {
        updateInspectionSampleResult(input:$input, isComplete: $isComplete)
    }
`