import React from "react";
import {rootUrl} from "../base.routes";
import axios from "axios";

const SimilarGame = (creatorId: number|string, genres: number|string) => {
    const [games, setGames] = React.useState<Game[]>([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    React.useEffect(()=> {
        axios.get(`https://localhost:4941${rootUrl}/games?creatorId=${creatorId.toString()}&genreIds=${genres.toString()}`)
            .then((response)=>{
                setGames(response.data['games']);
            })
    },[])
    return(
        <>
        </>
    )
}