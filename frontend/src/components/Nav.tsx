import { AppBar, Toolbar, Tooltip, Typography } from "@mui/material"
import { useContext, useEffect } from "react"
import { AppContext } from "../store/app"

const Nav = () => {
    const { appState } = useContext(AppContext)

    useEffect(() => {
        document.title = appState.title
    }, [appState.title])

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    TEST - {appState.title}
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
export default Nav