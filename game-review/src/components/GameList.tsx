import React, {ChangeEvent} from "react";
import axios from "axios";
import CSS from 'csstype';
import {Alert, AlertTitle, Pagination, PaginationItem, Paper, Stack} from "@mui/material";
import { rootUrl } from "../base.routes";
import GameListObject from "./GameListObject";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {alpha, styled} from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import LogInNavBar from "./LogInNavBar";
import LogoutNavBar from "./LogoutNavBar";
import {useUserStore} from "../store";

type GameListProps = {
    params: Record<string, string | number | boolean | any[]>;
};
const GameList = ({params}: GameListProps) => {
    const [games, setGames] = React.useState<Game[]>([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [characterSearching, setCharacterSearching] = React.useState("");
    const [triggerSearch, setTriggerSearch] = React.useState(false);
    const authorization = useUserStore();
    const userId = authorization.userId;
    const token = authorization.token;

    const triggerSearching = () => {
        setTriggerSearch(!triggerSearch);
    }

    React.useEffect(() => {
        console.log('state: ', triggerSearch);
        console.log('string: ', characterSearching);
        let filterParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => filterParams.append(key, String(v)));
            } else {
                filterParams.append(key, String(value));
            }
        });
        let url = `http://localhost:4941${rootUrl}/games`;
        if(characterSearching.trim()) {
            filterParams.append('q', characterSearching);
        }
        if (filterParams.toString()) {
            url += `?${filterParams.toString()}`;
        }
        console.log("Input params: ", filterParams);
        console.log("New url: ", url);
            const getGames = () => {
                axios.get(url,{headers: {
                    "X-Authorization": token
                    }})
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
        }, [triggerSearch]
    )
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
    const handlePaginationClick = (value: number) => {
        setCurrentPage(value);
        window.scrollTo({top:0});
    }
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
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
        setCharacterSearching(searchTerm)
        console.log('string: ', characterSearching);
    }
    const game_rows = () => games.slice((currentPage - 1) * 9, currentPage * 9).map((game: Game) => <GameListObject key={game.gameId + game.title} game={game}/>);
    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "block",
        width: "fit-content",
        minWidth: "1000px"
    }
    return (
        <>
            {userId && (
                <>
                    <LogInNavBar />
                </>
            )}
            {!userId && (
                <>
                    <LogoutNavBar />
                </>
            )}
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Stack direction="row" spacing={2}>
            <Paper elevation={3} style={card}>
                <Stack direction="row" spacing={2}>
                    {triggerSearch}
                    <Search >
                        <SearchIconWrapper>
                            <SearchIcon/>
                        </SearchIconWrapper>
                        <StyledInputBase
                            value={characterSearching}
                            onChange={handleInputChange}
                            placeholder="Search…"
                            // inputProps={{'aria-label': 'search'}}
                            type="text"

                        />
                    </Search>
                    <button onClick={triggerSearching}>Search</button>
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
                        onChange={(event, value) => handlePaginationClick(value)}
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
        </>
)

}
export default GameList;