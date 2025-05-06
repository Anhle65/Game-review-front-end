import LogInNavBar from "./LogInNavBar";
import {useParams} from "react-router-dom";
import React from "react";
import axios from "axios";
import {rootUrl} from "../base.routes";
import GameListObject from "./GameListObject";
import {Alert, AlertTitle, Pagination, PaginationItem, Paper} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const UserGames = () => {
    const {id} = useParams();
    const [games, setGames] = React.useState<Game[]>([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const handlePaginationClick = (value: number) => {
        setCurrentPage(value);
        window.scrollTo({top:0});
    }
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
    const creatorGames = games.filter(g=>g.creatorId === parseInt(id as string, 10))
    const game_rows = () => creatorGames.slice((currentPage - 1) * 9, currentPage * 9).map((game: Game) => <GameListObject key={game.gameId + game.title} game={game}/>);

    return(
        <>
            <LogInNavBar/>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <div style={{display: "inline-block", maxWidth: "965px", minWidth: "320px", padding:'20px'}}>
                {errorFlag ? (
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                ) : null}
                {game_rows()}
            </div>
            {creatorGames.length === 0 && (
                <h1>You haven't created game</h1>
            )}
            {creatorGames.length > 9 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Pagination
                        count={Math.ceil(creatorGames.length / 9)}
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
            )
            }
            </div>
        </>
    )
}
export default UserGames