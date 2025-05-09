import React, {ChangeEvent} from "react";
import axios from "axios";
import CSS from 'csstype';
import {Alert, AlertTitle, Fab, Pagination, PaginationItem, Paper, Stack} from "@mui/material";
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
    const authorization = useUserStore();
    const userId = authorization.userId;
    const token = authorization.token;

    React.useEffect(() => {
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
        }, [characterSearching]
    )
    const handlePaginationClick = (value: number) => {
        setCurrentPage(value);
        window.scrollTo({top:0});
    }
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCharacterSearching(e.target.value)
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
            <Paper elevation={3} style={card} sx={{justifyContent: 'flex-start',
                alignItems: 'flex-start'}}>
                <Stack direction="row" spacing={2}>
                    <SearchIcon fontSize='large'/>
                    <input type='text' style={{ width: "300px", overflowY: "auto" }} placeholder="Search..." className="form-control" id="input" value={characterSearching} onChange={handleInputChange} />
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