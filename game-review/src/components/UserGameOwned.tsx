import GameList from "./GameList";
import React from "react";

const UserGameOwned = () => {
    const myGameParams = {
        ownedByMe: true
    }
    return(
        <GameList params={myGameParams}/>
    )
}
export default UserGameOwned