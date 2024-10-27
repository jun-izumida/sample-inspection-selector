import { createContext } from "react"

export type PickUpItemType = {
    sequence: number
    selectItem: string | null
    validateItem: string | null
}

export type PickUpState = {
    isLoading: boolean
    isRegistered: boolean
    lot: string | null
    stages: number[] | null
    pickUpItem: PickUpItemType[]
    pickUpPeelSamples: {[key: string]: any} | null
    pickUpSamples: {[key: string]: any} | null
    timestamp: number
}

export type PickUpAction =
    | { type: "clear" }
    | { type: "setLoading", payload: boolean }
    | { type: "setLot", payload: string }
    | { type: "setStages", payload: number[] }
    | { type: "setPickUpPeelSamples", payload: {[key: string]: any} | null }
    | { type: "setPickUpSamples", payload: string[] | null }
    | { type: "setPickUpItem", payload: PickUpItemType[] }
    | { type: "setSearchSamples", payload: any }
    | { type: "updatePickUpItem", payload: PickUpItemType }
    | { type: "resetTimestamp" }


export const PickUpInitialState = {
    isLoading: false,
    isRegistered: false,
    lot: null,
    stages: null,
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
        case "setLot":
            next.lot = action.payload
            break
        case "setStages":
            next.stages = action.payload
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
            next.lot = action.payload.lot
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
                peel[String(v["stage"])] = v["lots"].map((w:any) => { return {"dmLot": w}})
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
