import GameList from "../game/GameList";
import React from "react";
import {useUserStore} from "../../store";

const UserGameReview = () => {
    const authorization = useUserStore();
    const userId = authorization.userId;
    const myGameParams = {
        reviewerId: userId
    }
    return(
        <GameList params={myGameParams}/>
    )
}
export default UserGameReview