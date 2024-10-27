import { createContext } from "react"

export type AppState = {
    title: string
}

export type AppAction =
    | { type: "setTitle", payload: string }

export const AppInitialState = {
    title: ""
}

export const AppReducer = (state:AppState, action:AppAction) => {
    const next: AppState = { ...state }
    switch (action.type) {
        case "setTitle":
            next.title = action.payload
            break
        default:
            break
    }
    return next
}

export const AppContext = createContext({} as {
    appState: AppState,
    appDispatch: React.Dispatch<AppAction>
})
