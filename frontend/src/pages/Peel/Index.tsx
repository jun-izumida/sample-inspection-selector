import { Box } from "@mui/material"
import Form from "./Form"
import Info from "./Info"
import Selection from "./Selection"
import { QRCodeSVG } from "qrcode.react"
import QRCodeDialog from "./QRCodeDialog"
import Ring from "./Ring"
import { Submit } from "./Submit"

export const DEMO_FRAME = [
  ["frame-1-block3", "frame-13-block3"],
  ["frame-3-block1", "frame-24-block4"],
  ["frame-4-block2", "frame-10-block3"],
  ["frame-1-block1", "frame-4-block4"],
  ["frame-4-block4", "frame-1-block1"],
]

const Index = () => {
  return (
    <Box sx={{position: 'relative'}}>
      <Form />
      <hr />
      <Selection />
      <hr />
      <Ring />
      <Submit />
    </Box>
  )
}
export default Index