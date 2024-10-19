import { createContext } from "react"

export type PickUpState = {
    isLoading: boolean
}

export type PickUpAction =
    | { type: "setLoading", payload: boolean }

export const PickUpInitialState = {
    isLoading: false
}

export const PickUpReducer = (state:PickUpState, action:PickUpAction) => {
    const next: PickUpState = { ...state }
    switch (action.type) {
        case "setLoading":
            next.isLoading = action.payload
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
