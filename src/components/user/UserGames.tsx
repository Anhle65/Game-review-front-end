import React from "react";
import {useUserStore} from "../../store";
import GameList from "../game/GameList";

const UserGames = () => {
    const authorization = useUserStore();
    const userId = authorization.userId;
    const myGameParams = {
        creatorId: parseInt(userId,10)
    }
    return(
        <GameList params={myGameParams}/>
    )
}
export default UserGames