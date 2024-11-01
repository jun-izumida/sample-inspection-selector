import { createContext } from "react"

export type PickUpItemType = {
    sequence: number
    selectItem: string | null
    validateItem: string | null
}

export type PickUpState = {
    isLoading: boolean
    isRegistered: boolean
    result: any | null
    stages: number[] | null
    stageCount: any | null
    pickUpItem: PickUpItemType[]
    pickUpPeelSamples: {[key: string]: any} | null
    pickUpSamples: {[key: string]: any} | null
    timestamp: number
}

export type PickUpAction =
    | { type: "clear" }
    | { type: "setLoading", payload: boolean }
    | { type: "setResult", payload: any }
    | { type: "setStages", payload: number[] }
    | { type: "setStageCount", payload: any }
    | { type: "setPickUpPeelSamples", payload: {[key: string]: any} | null }
    | { type: "setPickUpSamples", payload: string[] | null }
    | { type: "setPickUpItem", payload: PickUpItemType[] }
    | { type: "setSearchSamples", payload: any }
    | { type: "updatePickUpItem", payload: PickUpItemType }
    | { type: "resetTimestamp" }


export const PickUpInitialState = {
    isLoading: false,
    isRegistered: false,
    result: null,
    stages: null,
    stageCount: null,
    pickUpItem: [],
    pickUpPeelSamples: null,
    pickUpSamples: null,
    timestamp: new Date().getTime()
}

export const PickUpReducer = (state:PickUpState, action:PickUpAction) => {
    const next: PickUpState = { ...state }
    switch (action.type) {
        case "clear":
            return {...PickUpInitialState}
        case "setLoading":
            next.isLoading = action.payload
            break
        case "setResult":
            next.result = action.payload
            break
        case "setStages":
            next.stages = action.payload
            break
        case "setStageCount":
            next.stageCount = action.payload
            break
        case "setPickUpSamples":
            next.pickUpSamples = action.payload
            break
        case "setPickUpPeelSamples":
            next.pickUpPeelSamples = action.payload
            break
        case "setPickUpItem":
            next.pickUpItem = action.payload
            break
        case "setSearchSamples":
            next.isRegistered = true
            next.result = action.payload.resulw
            next.stages = action.payload.stages
            next.pickUpItem = action.payload.crossSectionSamples.map((v:any, i:number) => {
                return {
                    sequence: i,
                    selectItem: v.lot,
                    validateItem: v.lot
                }
            })
            const peel:{[key: string]: any} = {}
            action.payload.peelSamples.forEach((v: any) => {
                peel[String(v["stage"])] = v["lots"].map((w:any) => { return w})
            })
            next.pickUpPeelSamples = peel
            break
        case "updatePickUpItem":
            next.pickUpItem = [...next.pickUpItem.filter((v:PickUpItemType) => {
                return v.sequence != action.payload.sequence
            }), action.payload]
            break
        case "resetTimestamp":
            next.timestamp = new Date().getTime();
            break
        default:
            break
    }
    return next
}

export const PickUpContext = createContext({} as {
    pickupState: PickUpState,
    pickupDispatch: React.Dispatch<PickUpAction>
})
