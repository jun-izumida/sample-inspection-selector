import { Box } from "@mui/material"
import Form from "./Form"
import Info from "./Info"
import Selection from "./Selection"
import { QRCodeSVG } from "qrcode.react"
import QRCodeDialog from "./QRCodeDialog"

const Index = () => {
  return (
    <Box>
      <Form />
      <Info />
      <hr />
      <Selection />
      <QRCodeDialog />
    </Box>
  )
}
export default Index