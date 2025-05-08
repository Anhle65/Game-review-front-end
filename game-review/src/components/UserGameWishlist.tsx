import GameList from "./GameList";
import React from "react";

const UserGameWishlist = () => {
    const myGameParams = {
        wishlistedByMe: true
    }
    return(
        <GameList params={myGameParams}/>
    )
}
export default UserGameWishlist