import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import {Stack} from "@mui/material";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AppBar from "@mui/material/AppBar";
import * as React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {rootUrl} from "../base.routes";
import axios from "axios";

const LogInNavBar = () => {
    let {id} = useParams();
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const [userImage, setUserImage] = React.useState("");
    const [fName, setfName] = React.useState('');
    const [lName, setlName] = React.useState('');
    const loginId = localStorage.getItem('userId');

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCreateGame = () => {
        setAnchorElUser(null);
        navigate(rootUrl+'/games/create');
    }
    const handleLogout = async () =>{
        const token = localStorage.getItem("token");
        console.log('authToken: ' + token);
        await axios.post('http://localhost:4941'+rootUrl+'/users/logout', {},
            {
                headers: {
                    "X-Authorization": token
                },
                timeout: 10000
            });
        navigate(rootUrl+'/games');
        window.location.reload();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    }
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    React.useEffect(()=> {
        if(id !== loginId && loginId) {
            id = loginId;
        }
        axios.get('http://localhost:4941' + rootUrl + '/users/' + id + '/image', {
            responseType: 'blob',
        })
            .then((response) => {
                const imgUrl = URL.createObjectURL(response.data);
                setUserImage(imgUrl);
            }).catch((error) => {
            console.error("Failed to load image", error);
        });
    }, []);
    React.useEffect(()=> {
        if(id !== loginId && loginId) {
            id = loginId;
        }
        axios.get('http://localhost:4941' + rootUrl + '/users/' + id)
            .then((response) => {
                setfName(response.data.firstName);
                setlName(response.data.lastName);
            }).catch((error) => {
            console.error("Failed to load image", error);
        });
    }, []);
    const handleDashboardClick = () => {
        if (window.location.pathname.endsWith('games/') || window.location.pathname.endsWith('games')) {
            window.location.reload();
        } else {
            navigate(rootUrl+'/games');
        }
    };
    const handleProfileClick = () => {
        navigate(rootUrl+'/users/'+id+"/profile");
    }
    return(
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
                                onClick={handleCreateGame}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                New Game
                            </Button>
                            <Button
                                onClick={handleCreateGame}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                My Game
                            </Button>
                        </Stack>
                    </Box>
                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                <Avatar alt="User Image" src={userImage.length !== 0 ? userImage : "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {fName} {lName}
                            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                            <MenuItem onClick={handleCreateGame}>Edit Information</MenuItem>
                            <MenuItem onClick={handleLogout}>Log out</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
export default LogInNavBar;