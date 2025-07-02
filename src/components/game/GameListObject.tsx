import React from "react";
import axios from "axios";
import CSS from 'csstype';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Stack,
    Avatar,
    Alert,
    AlertTitle
} from "@mui/material";
import {rootUrl} from "../../base.routes";
import {NavLink, useNavigate} from "react-router-dom";
interface IGameProps {
    game: Game
}
const GameListObject = (props: IGameProps) => {
    const navigate = useNavigate();
    const [game] = React.useState<Game> (props.game);
    const [genres, setGenres] = React.useState<Genre[]>([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [platforms, setPlatforms] = React.useState<Platform[]>([]);
    const [image, setImage] = React.useState("");
    const [creatorImage, setCreatorImage] = React.useState("");
    const gameGenre = genres.find(g => g.genreId === game.genreId);
    const allPlatforms = game.platformIds.map(id => platforms.find(p => p.platformId === id)?.name)
                                                .filter((name): name is string => !!name);  //Only keep values where name is truthy — i.e., a non-empty string, and not undefined or null.
    const platformsName = allPlatforms.join(', ');
    React.useEffect(()=> {
        axios.get('http://localhost:4941'+rootUrl+'/users/' + game.creatorId + '/image', {
            responseType: 'blob',
        })
            .then((response) => {
                if (response.data){
                    const imgUrl = URL.createObjectURL(response.data);
                    setCreatorImage(imgUrl);
                }
                setErrorFlag(false);
                setErrorMessage("");
            },(error) => {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 404) {
                        setErrorFlag(false);
                        setErrorMessage('');
                    } else {
                        setErrorFlag(true);
                        console.error("Failed to load image", error);
                    }
                } else {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                    setCreatorImage('');
                }
            });
    }, [game.creatorId]);
    React.useEffect(() => {
        const getGenres = () => {
            axios.get('http://localhost:4941' +rootUrl+'/games/genres')
                .then((response) => {
                    setGenres(response.data)
                    setErrorFlag(false);
                    setErrorMessage("");
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString() + " defaulting to old users changes app may not work as expected")
                })
        }
        getGenres()
    },[setGenres])
    React.useEffect(() => {
        axios.get('http://localhost:4941'+rootUrl+'/games/' + game.gameId + '/image', {
            responseType: 'blob',
        })
            .then((response) => {
                if(response.data) {
                    const imgUrl = URL.createObjectURL(response.data);
                    setImage(imgUrl);
                }
                setErrorFlag(false);
                setErrorMessage("");
        }, (error) => {
            setImage('');
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    setErrorFlag(false);
                    setErrorMessage("");
                } else {
                    setErrorFlag(true);
                    console.error("Failed to load image", error);
                }
            }
        });
    }, [game.gameId]);
    React.useEffect(() => {
        const getPlatforms = ()=> {
            axios.get('http://localhost:4941'+rootUrl+'/games/platforms/')
                .then((response) => {
                    setPlatforms(response.data);
                }, (error)=>{
                    console.error("Failed to get platforms", error);
                })
        }
        getPlatforms();
    }, [])
    const gameCardStyles: CSS.Properties = {
        display: "inline-block",
        objectFit: "contain",
        height: "560px",
        width: "100%",
        maxWidth: "300px",
        padding: "1rem",
        overflowWrap: 'normal'
    }
    return(
        <>
            {errorFlag ? (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>
            ) : null}
        <Card sx={gameCardStyles} >
            <CardMedia
                component="img"
                height="300em"
                width="200em"
                sx={{objectFit:"cover"}}
                image={image.length > 0 ? image: "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"}
                alt="Auction hero"
                onClick={() => navigate('/game-review/games/' + game.gameId)}
            />
            <CardContent>
                <Typography variant="h6" sx={{fontWeight: 'bold', fontFamily: 'monospace'}}>
                    <NavLink to={'/games/' + game.gameId} end>
                        {game.title}
                    </NavLink>
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Typography variant="subtitle1" align="left" sx={{fontWeight: 'normal'}} >
                        Genre: {gameGenre?.name}
                        <br/>
                        Platforms: {platformsName}
                        <br/>
                        Creator: {game.creatorFirstName} {game.creatorLastName}
                    </Typography>
                    <div>
                        {game.price/100 > 0 ? (
                            <Typography variant="h5" align="center" sx={{fontWeight: 'bold'}}>
                                ${game.price/100}
                            </Typography>
                        ): (
                            <Typography variant="h5" align="center" sx={{color:'red', fontWeight: 'bold'}}>
                                Free
                        </Typography>
                        )}

                        <Avatar alt="Creator Image" sx={{ width: 70, height: 70 }} src={creatorImage.length !== 0 ? creatorImage : "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"} />
                    </div>
                </Stack>
                Created on : {new Date(game.creationDate).toLocaleDateString()}
            </CardContent>
        </Card>
        </>
    )
}
export default GameListObject