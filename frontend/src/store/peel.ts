import { createContext } from "react"

export type PeelState = {

}

export type PeelAction =
    | { type: "setLoading", payload: boolean }

export const PeelContext = createContext({} as {
    appState: PeelState,
    appDispatch: React.Dispatch<PeelAction>
})
