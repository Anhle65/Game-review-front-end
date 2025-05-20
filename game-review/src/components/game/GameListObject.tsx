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
        height: "500px",
        width: "300px",
        margin: "10px",
        padding: "0px"
    }
    return(
        <>
            {errorFlag ? (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>
            ) : null}
        <Card sx={gameCardStyles}>
            <CardMedia
                component="img"
                height="300"
                width="200"
                sx={{objectFit:"cover"}}
                image={image.length > 0 ? image: "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"}
                alt="Auction hero"
                onClick={() => navigate('/games/' + game.gameId)}
            />
            <CardContent>
                <Typography variant="h6">
                    <NavLink to={'/games/' + game.gameId} end>
                        {game.title}
                    </NavLink>
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Typography variant="subtitle2" align="left"  >
                        Genre: {gameGenre?.name}
                        <br/>
                        Platforms: {platformsName}
                        <br/>
                        Creator: {game.creatorFirstName} {game.creatorLastName}
                        <br/>
                        Created on : {new Date(game.creationDate).toLocaleDateString()}
                    </Typography>
                    <div>
                        <Typography variant="h6" align="right">
                            ${game.price/100}
                        </Typography>
                        <Avatar alt="Creator Image" src={creatorImage.length !== 0 ? creatorImage : "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"} />
                    </div>
                </Stack>
            </CardContent>
        </Card>
        </>
    )
}
export default GameListObject