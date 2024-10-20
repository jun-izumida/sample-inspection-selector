import { createContext } from "react"

export type PickUpItemType = {
    sequence: number
    selectItem: string | null
    validateItem: string | null
}

export type PickUpState = {
    isLoading: boolean
    pickUpItem: PickUpItemType[],
    pickUpSamples: {[key: string]: any} | null
}

export type PickUpAction =
    | { type: "setLoading", payload: boolean }
    | { type: "setPickUpSamples", payload: {[key: string]: any} | null }
    | { type: "setPickUpItem", payload: PickUpItemType[] }
    | { type: "updatePickUpItem", payload: PickUpItemType }

export const PickUpInitialState = {
    isLoading: false,
    pickUpItem: [],
    pickUpSamples: null,
}

export const PickUpReducer = (state:PickUpState, action:PickUpAction) => {
    const next: PickUpState = { ...state }
    switch (action.type) {
        case "setLoading":
            next.isLoading = action.payload
            break
        case "setPickUpSamples":
            next.pickUpSamples = action.payload
            break
        case "setPickUpItem":
            next.pickUpItem = action.payload
            break
        case "updatePickUpItem":
            next.pickUpItem = [...next.pickUpItem.filter((v:PickUpItemType) => {
                return v.sequence != action.payload.sequence
            }), action.payload]
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
