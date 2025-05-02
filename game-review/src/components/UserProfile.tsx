import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {useNavigate, useParams} from "react-router-dom";
import {rootUrl} from "../base.routes";
import GameList from "./GameList";
import axios from "axios";
import {Stack} from "@mui/material";

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function UserProfile() {
    const {id} = useParams();
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const [userImage, setUserImage] = React.useState("");

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCreateGame = () => {
        setAnchorElUser(null);
        navigate(rootUrl+'/games/create');
    }
    const handleDashboard = () => {
        setAnchorElUser(null);
        navigate(rootUrl+'/games');
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
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    }
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    React.useEffect(()=> {
        axios.get('http://localhost:4941'+rootUrl+'/users/' + id + '/image', {
            responseType: 'blob',
        })
            .then((response) => {
                const imgUrl = URL.createObjectURL(response.data);
                setUserImage(imgUrl);
            }).catch((error) => {
            console.error("Failed to load image", error);
        });
    }, []);
    return (
        <><AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{display: {xs: 'block', md: 'none'}}}
                        >
                            <MenuItem onClick={handleCreateGame}>Dashboard</MenuItem>
                            <MenuItem onClick={handleCreateGame}>Create Game</MenuItem>
                            <MenuItem onClick={handleCreateGame}>My Game</MenuItem>
                        </Menu>
                    </Box>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        <Stack direction="row" spacing={2} sx={{
                            justifyContent: "space-around",
                            alignItems: "center",
                        }}>
                        <Button
                            onClick={handleCreateGame}
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
                            <MenuItem onClick={handleCreateGame}>Profile</MenuItem>
                            <MenuItem onClick={handleCreateGame}>Edit Information</MenuItem>
                            <MenuItem onClick={handleLogout}>Log out</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar><GameList/></>
    );
}
export default UserProfile;
