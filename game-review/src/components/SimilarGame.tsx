import React from "react";
import axios from "axios";
import { Pagination, PaginationItem, Paper, Stack, Box, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GameListObject from "./GameListObject";
import CSS from "csstype";
import {useParams} from "react-router-dom";
type SimilarGameProps = {
    creatorId: number;
    genreId: number;
};
const SimilarGame = (props: SimilarGameProps) => {
    const [games, setGames] = React.useState<Game[]>([]);
    const {id} = useParams();
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    React.useEffect(()=> {
        fetchGames().then((response) => {
            console.log('update games',games);
                // game_rows();
            }
        );

    }, [props])

    const fetchGames = async () => {
        const [gameByCreatorId, gameByGenreId] = await Promise.all([
            axios.get(`http://localhost:4941/api/v1/games?creatorId=${props.creatorId}`),
            axios.get(`http://localhost:4941/api/v1/games?genreIds=${props.genreId}`),
        ]);
        const combinedGames = [...gameByCreatorId.data.games, ...gameByGenreId.data.games];
        const uniqueGames = Array.from(
            new Map(combinedGames.map((g) => [g.gameId, g])).values()
        );
        setCurrentPage(1);
        if(id) {
            const similargames = uniqueGames.filter((g: any) => g.gameId !== parseInt(id));
            setGames(similargames);
            return similargames;
        } else {
            setGames(uniqueGames);
            return uniqueGames;
        }
    }

    const game_rows = () => {
        return(games.slice((currentPage - 1) * 3, currentPage * 3).map((game: Game) => <GameListObject
            key={game.gameId + game.title + 'similar'} game={game}/>))
    };

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "block",
        width: "fit-content",
        minWidth: "1000px"
    }
    const handlePaginationClick = (value: number) => {
        setCurrentPage(value);
    }
    return(
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                }}>
                    <Stack direction="row" spacing={2}>
                        <Paper elevation={3} style={card} sx={{justifyContent: 'center',
                            alignItems: 'center'}}>
                            <Typography variant='h5' sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                            }}>Similar Games:</Typography>
                            {/*<div style={{display: "inline-block", maxWidth: "965px", minWidth: "320px"}}>*/}
                                <Box sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                }}>
                                    {game_rows()}
                                </Box>
                            {/*</div>*/}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Pagination
                                    count={Math.ceil(games.length / 3)}
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
                </Box>
            </div>
        </>
    )
}
export default SimilarGame;