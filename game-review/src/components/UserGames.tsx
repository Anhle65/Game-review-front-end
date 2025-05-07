import LogInNavBar from "./LogInNavBar";
import {useParams} from "react-router-dom";
import React from "react";
import axios from "axios";
import {rootUrl} from "../base.routes";
import GameListObject from "./GameListObject";
import {Alert, AlertTitle, Pagination, PaginationItem, Paper} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {useUserStore} from "../store";
import GameList from "./GameList";

const UserGames = () => {
    const {id} = useParams();
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const authorization = useUserStore();
    const userId = authorization.userId;
    const token = authorization.token;
    const myGameParams = {
        ownedByMe: true,
        // wishlistedByMe: true,
        // reviewerId: userId
    }
    return(
        <>
            <GameList params={myGameParams}/>
        </>
    )
}
export default UserGames