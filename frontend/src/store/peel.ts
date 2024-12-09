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
    isRegistered: boolean
    isRequest: boolean | null
    isComplete: boolean | null
    lot: string | null
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
    | { type: "setRegistered", payload: boolean }
    | { type: "setSampleRequest", payload: any }
    | { type: "setActiveStage", payload: number }
    | { type: "setActiveSample", payload: any }
    | { type: "changeStatus", payload: any }
    | { type: "resetTimestamp" }


export const PeelInitialState = {
    isLoading: false,
    isRegistered: false,
    isRequest: null,
    isComplete: null,
    lot: null,
    stages: [],
    activeStage: null,
    activeSample: null,
    pickUpPeelSamples: null,
    stairs: [],
    timestamp: new Date().getTime()
}

export const PeelReducer = (state: PeelState, action:PeelAction) => {
    const next: PeelState = { ...state }
    switch (action.type) {
        case "clear":
            return PeelInitialState
        case "setLoading":
            next.isLoading = action.payload
            break
        case "setRegistered":
            next.isRegistered = action.payload
            break
        case "setSampleRequest":
            next.lot = action.payload["lot"]
            next.stages = action.payload["stages"]
            next.isRequest = action.payload["isRequest"]
            next.isComplete = action.payload["isComplete"]
            next.pickUpPeelSamples = action.payload["peelSamples"] != null ? action.payload["peelSamples"].map((v:any) => {
                return {
                    "stage": v.stage,
                    "lots": v.lots.map((w:any) => {
                        return {
                            dmCode: w.dmCode,
                            dmLot: w.dmLot,
                            dmStage: w.dmStage,
                            dmSuffix: w.dmSuffix,
                            ring: w.ring,
                            sequence: w.sequence,
                            isUse: w.isUse == null ? false : w.isUse,
                            isValidate: w.isValidate == null ? false : w.isValidate,
                            isPass: w.isPass == null ? false : w.isPass,
                        }
                    })
                }
            }) : []
            break
        case "changeStatus":
            if (next.pickUpPeelSamples != null) {
                const stage = next.pickUpPeelSamples.filter((v:any) => v.stage == action.payload["stage"])[0]
                const target = stage["lots"].filter((v:any) => v.dmCode == action.payload["dmCode"])[0]
                switch (action.payload["field"]) {
                    case "isUse":
                        target.isUse = action.payload["value"]
                        break
                    case "isValidate":
                        target.isValidate = action.payload["value"]
                        break
                    case "isPass":
                        target.isPass = action.payload["value"]
                        break
                    default:
                        break
                }
                const sample = [
                    ...stage["lots"].filter((v:any) => v.dmCode != action.payload["dmCode"]), target
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
