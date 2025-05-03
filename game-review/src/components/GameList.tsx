import React from "react";
import axios from "axios";
import CSS from 'csstype';
import {Alert, AlertTitle, Pagination, PaginationItem, Paper, Stack} from "@mui/material";
import {useGameStore} from "../store";
import { rootUrl } from "../base.routes";
import GameListObject from "./GameListObject";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {useNavigate} from "react-router-dom";
import {alpha, styled} from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import AppBar from "@mui/material/AppBar";
const GameList = () => {
    const games = useGameStore(state => state.games);
    const genres = useGameStore(state => state.genres);
    const setGames = useGameStore(state => state.setGames);
    const setGenres = useGameStore(state => state.setGenres);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const navigate = useNavigate();

    React.useEffect(() => {
            const getGames = () => {
                axios.get('http://localhost:4941' +rootUrl+'/games')
                    .then((response) => {
                        setErrorFlag(false);
                        setGames(response.data['games']);
                        setErrorMessage("");
                    }, (error) => {
                        setErrorFlag(true);
                        setErrorMessage(error.toString() + " defaulting to old users changes app may not work as expected")
                    })
            }
            getGames();
        }, [setGames]
    )
    React.useEffect(() => {
        const getGenres = () => {
            axios.get('http://localhost:4941' +rootUrl+'/games/genres')
                .then((response) => {
                    setGenres(response.data)
                    setErrorFlag(false);
                    setErrorMessage("");
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString() + " defaulting to old users changes app may not work as expected")
                })
        }
        getGenres()
    },[setGenres])
    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        width: '100%',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
    }));
    const handleSignUp = () => {
        navigate(rootUrl+'/users/register');
    }
    const handleLogIn = () => {
        navigate(rootUrl+'/users/login');
    }
    const game_rows = () => games.slice((currentPage - 1) * 9, currentPage * 9).map((game: Game) => <GameListObject key={game.gameId + game.title} game={game} genres={genres}/>);
    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "block",
        width: "fit-content"
    }
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <AppBar position="absolute">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                            <Stack direction="row" spacing={2} sx={{
                                justifyContent: "space-around",
                                alignItems: "center",
                            }}>
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
            <Stack direction="row" spacing={2}>
            <Paper elevation={3} style={card}>
                {/*<h1> </h1>*/}
                <Stack direction="row" spacing={2}>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                </Stack>
                <div style={{display: "inline-block", maxWidth: "965px", minWidth: "320px"}}>
                    {errorFlag ? (
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>
                    ) : null}
                    {game_rows()}
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Pagination
                        count={Math.ceil(games.length / 9)}
                        showFirstButton showLastButton
                        onChange={(event, value) => setCurrentPage(value)}
                        renderItem={(item) => (
                            <PaginationItem
                                slots={{previous: ArrowBackIcon, next: ArrowForwardIcon}}
                                {...item}
                            />
                        )}
                    />
                </div>
            </Paper>
            </Stack>
        </div>
)

}
export default GameList;