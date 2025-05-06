import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import {Stack} from "@mui/material";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import React from "react";
import {useNavigate} from "react-router-dom";

const LogoutNavBar = () => {
    const navigate = useNavigate();
    const handleSignUp = () => {
        navigate('/users/register');
    }
    const handleLogIn = () => {
        navigate('/users/login');
    }
    const handleDashboardClick = () => {
        if (window.location.pathname.endsWith('games/') || window.location.pathname.endsWith('games')) {
            window.location.reload();
        } else {
            navigate('/games');
        }
    };
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'flex'}}}>
                        <Stack direction="row" spacing={2} sx={{
                            justifyContent: "space-around",
                            alignItems: "center",
                        }}>
                            <Button
                                onClick={handleDashboardClick}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                Dashboard
                            </Button>
                            <Button
                                onClick={handleLogIn}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                Log-in
                            </Button>
                            <Button
                                onClick={handleSignUp}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                Sign-up
                            </Button>
                        </Stack>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
export default LogoutNavBar;