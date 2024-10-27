import { createContext } from "react"

export type FrameType = {
    code: string
}

export type StairType = {
    sequence: number
    frames: FrameType[]
}

export type PeelState = {
    isLoading: boolean
    stairs: StairType[] | null
}

export type PeelAction =
    | { type: "SetLoading", payload: boolean }
    | { type: "SetStairs", payload: string[][] }


export const PeelInitialState = {
    isLoading: false,
    stairs: []
}

const GetStairs = (payload: string[][]): StairType[] | null => {
    const stairs = payload.map((v:any) => {
        return {
            sequence: 1,
            frames:[]
        }
    })
    return stairs
}

export const PeelReducer = (state: PeelState, action:PeelAction) => {
    const next: PeelState = { ...state }
    switch (action.type) {
        case "SetStairs":
            next.stairs = GetStairs(action.payload)
            break
        default:
            break
    }
    return next
}

export const PeelContext = createContext({} as {
    peelState: PeelState,
    peelDispatch: React.Dispatch<PeelAction>
})
