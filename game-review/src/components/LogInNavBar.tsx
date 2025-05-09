import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import {ListItemIcon, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AppBar from "@mui/material/AppBar";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import {rootUrl} from "../base.routes";
import axios from "axios";
import {useUserStore} from "../store";
import {Edit, Logout} from "@mui/icons-material";

const LogInNavBar = () => {
    const authorization = useUserStore();
    const userId = authorization.userId;
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [anchorElGame, setAnchorElGame] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const [userImage, setUserImage] = React.useState("");
    const [fName, setfName] = React.useState('');
    const [lName, setlName] = React.useState('');
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleEditProfile = () => {
        setAnchorElUser(null);
        navigate('/users/'+userId+'/edit');
    }
    const handleCreateGame = () => {
        navigate('/games/create');
    }
    const handleReviewedGame = () => {
        navigate('/users/' +userId+'/reviewed');
    }

    const handleMyGameClick = () => {
        navigate('/users/'+userId+'/myGames');
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
        navigate('/games');
        window.location.reload();
        authorization.removeAuthorization();
    }
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleWishlistClick = () => {
        navigate('/users/' +userId+'/wishlisted');
    }
    const handleOwnedClick = () => {
        navigate('/users/' +userId+'/owned');
    }
    React.useEffect(()=> {
        axios.get('http://localhost:4941' + rootUrl + '/users/' + userId + '/image', {
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
        axios.get('http://localhost:4941' + rootUrl + '/users/' + userId)
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
            navigate('/games');
        }
    };
    const handleProfileClick = () => {
        if (window.location.pathname.endsWith('profile/') || window.location.pathname.endsWith('profile')) {
            window.location.reload();
        } else {
            navigate('/users/'+ userId +'/profile');
        }
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
                            <Button sx={{my: 2, color: 'white', display: 'block'}} onClick={handleReviewedGame}>Reviews</Button>
                            <Button sx={{my: 2, color: 'white', display: 'block'}} onClick={handleWishlistClick}>In Wishlist</Button>
                            <Button sx={{my: 2, color: 'white', display: 'block'}} onClick={handleOwnedClick}>Owned</Button>
                            <Button sx={{my: 2, color: 'white', display: 'block'}} onClick={handleMyGameClick}>My game</Button>
                        </Stack>
                    </Box>
                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                <Avatar alt="User Image" src={userImage.length !== 0 ? userImage : "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{mt: '45px', justifyContent: "space-around",
                                alignItems: "center"}}
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
                            <MenuItem onClick={handleEditProfile}>
                                <ListItemIcon>
                                    <Edit fontSize="small" />
                                </ListItemIcon>
                                Edit Information</MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
export default LogInNavBar;