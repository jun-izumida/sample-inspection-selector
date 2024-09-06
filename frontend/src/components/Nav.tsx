import { AppBar, Toolbar, Tooltip, Typography } from "@mui/material"

const Nav = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    TEST
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
export default Nav