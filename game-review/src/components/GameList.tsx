import React from "react";
import axios from "axios";
import CSS from 'csstype';
import {Alert, AlertTitle, Paper} from "@mui/material";
import {useGameStore} from "../store";
import { rootUrl } from "../base.routes";
import GameListObject from "./GameListObject";

const GameList = () => {
    const games = useGameStore(state => state.games);
    const setGames = useGameStore(state => state.setGames);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
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
    const user_rows = () => games.map((game: Game) => <GameListObject key={game.gameId + game.title} game={game}/>);
    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "block",
        width: "fit-content"
    }
    return (
        <Paper elevation={3} style={card} >
            <h1>UserList </h1>
            <div style={{ display: "inline-block", maxWidth: "965px", minWidth: "320px" }}>
                { errorFlag ? (
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                ) : null }
                { user_rows() }
            </div>
        </Paper>
    )

}
export default GameList;