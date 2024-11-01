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
    stages: number[]
    activeStage: number | null
    activeSample: any | null
    pickUpPeelSamples: {[key: string]: any} | null
    stairs: StairType[] | null
    timestamp: number
}

export type PeelAction =
    | { type: "clear" }
    | { type: "setLoading", payload: boolean }
    | { type: "setStages", payload: number[] }
    | { type: "setActiveStage", payload: number }
    | { type: "setActiveSample", payload: any }
    | { type: "setIsUse", payload: any }
    | { type: "setPickUpPeelSamples", payload: {[key: string]: any} | null }
    | { type: "SetStairs", payload: string[][] }
    | { type: "resetTimestamp" }


export const PeelInitialState = {
    isLoading: false,
    stages: [],
    activeStage: null,
    activeSample: null,
    pickUpPeelSamples: null,
    stairs: [],
    timestamp: new Date().getTime()
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
        case "clear":
            return PeelInitialState
            break
        case "SetStairs":
            next.stairs = GetStairs(action.payload)
            break
        case "setStages":
            next.stages = action.payload
            break
        case "setIsUse":
            if (next.pickUpPeelSamples != null) {
                const stage = next.pickUpPeelSamples.filter((v:any) => v.stage == action.payload["stage"])[0]
                const target = stage["lots"].filter((v:any) => v.dmLot == action.payload["dmLot"] && v.sequence == action.payload["sequence"])[0]
                target.isUse = action.payload["checked"]
                const sample = [
                    ...stage["lots"].filter((v:any) => v.dmLot != action.payload["dmLot"] && v.sequence != action.payload["sequence"]), target
                ]
                stage["lots"] = sample
                next.pickUpPeelSamples = [
                    ...next.pickUpPeelSamples.filter((v:any) => v.stage != action.payload["stage"]),
                    stage
                ]
            }
            break
        case "setActiveStage":
            next.activeStage = action.payload
            break
        case "setActiveSample":
            next.activeSample = action.payload
            break
        case "setPickUpPeelSamples":
            next.pickUpPeelSamples = action.payload != null ? action.payload.map((v:any) => {
                return {
                    "stage": v.stage,
                    "lots": v.lots.map((w:any) => {
                        return {
                            ...w,
                            isUse: false
                        }
                    })
                }
            }) : []
            break
        case "resetTimestamp":
            next.timestamp = new Date().getTime();
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
