import React from "react";
import {useGameStore} from "../store";
import axios from "axios";
import CSS from 'csstype';
import {
    Card, CardActions, CardContent, CardMedia, IconButton, Typography,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, Stack, Paper, Avatar
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import {rootUrl} from "../base.routes";
import {useParams} from "react-router-dom";
import LogInNavBar from "./LogInNavBar";
import LogoutNavBar from "./LogoutNavBar";
const Game = () => {
    const {id} = useParams();
    const [game, setGame] = React.useState<Game> ({
        numberOfOwners: 0, numberOfWishlists: 0,
        creationDate: "",
        creatorFirstName: "",
        creatorId: 0,
        creatorLastName: "",
        gameId: 0,
        genreId: 0,
        platformIds: [],
        price: 0,
        rating: 0,
        title: "",
        description: ""
    });
    const [gameReviews, setGameReviews] = React.useState<Review[]>([]);
    const [gamename, setgamename] = React.useState("");
    const [image, setImage] = React.useState("");
    const [creatorImage, setCreatorImage] = React.useState("");
    const [genres, setGenre] = React.useState<Array<Genre>> ([]);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const deleteGameFromStore = useGameStore(state => state.removeGame);
    const editGameFromStore = useGameStore(state => state.editGame);
    const genreName = genres.find(g => g.genreId === game.genreId)
    const userId = localStorage.getItem('userId');
    const [platforms, setPlatforms] = React.useState<Platform[]>([]);
    const allPlatforms = game.platformIds.map(id => platforms.find(p => p.platformId === id)?.name)
        .filter((name): name is string => !!name);  //Only keep values where name is truthy — i.e., a non-empty string, and not undefined or null.
    const platformsName = allPlatforms.join(', ');
    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    }
    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
    }
    const deleteGame = () => {
        axios.delete('http://localhost:4941'+rootUrl+'/games/' + id)
            .then(() => {
                deleteGameFromStore(game);
            })
    }
    const updateGamenameState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setgamename(event.target.value)
    }
    const editGame = () => {
        axios.put('http://localhost:4941'+rootUrl+'/games/' + game.gameId, {"gamename": gamename})
            .then(() => {
                editGameFromStore(game, gamename);
            })
    }
    React.useEffect(() => {
            const getGame = () => {
                axios.get('http://localhost:4941' +rootUrl+'/games/' + id)
                    .then((response) => {
                        setGame(response.data);
                    })
            }
            getGame();
        }, [id]
    )
    React.useEffect(()=> {
        const getReviews = () => {
            axios.get('http://localhost:4941' +rootUrl+'/games/' + id + '/reviews')
                .then((response) => {
                    setGameReviews(response.data)
                })
        }
        getReviews();
    },[id])
    React.useEffect(()=> {
        axios.get('http://localhost:4941'+rootUrl+'/users/' + game.creatorId + '/image', {
            responseType: 'blob',
        })
            .then((response) => {
                console.log(game.creatorId);
                const imgUrl = URL.createObjectURL(response.data);
                setCreatorImage(imgUrl);
            }).catch((error) => {
            console.error("Failed to load image", error);
        });
    }, [game.creatorId]);
    const gameCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "1600px",
        width: "800px",
        margin: "10px",
        padding: "0px"
    }
    React.useEffect(() => {
        const getGenres = () => {
            axios.get('http://localhost:4941'+rootUrl+'/games/genres')
                .then((response) => {
                    setGenre(response.data);
                })
        }
        getGenres();
    }, []);
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
    }, []);
    React.useEffect(()=> {
        axios.get('http://localhost:4941'+rootUrl+'/games/' + id + '/image', {
            responseType: 'blob',
        })
            .then((response) => {
                const imgUrl = URL.createObjectURL(response.data);
                setImage(imgUrl);
            }).catch((error) => {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 404) {
                    console.error("Failed to load image", error);
                }
            }
        });
    }, []);
    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "block",
        width: "fit-content"
    }
    return(
        <>
        {userId && (
            <>
                <LogInNavBar />
            </>
        )}
        {!userId && (
            <>
                <LogoutNavBar />
            </>
        )}
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {/*<Paper>*/}
                <Card sx={card}>
                    <CardMedia
                        component="img"
                        sx={{objectFit:"cover"}}
                        image={image}
                        alt="Auction hero"
                    />
                    <CardContent>
                        <Typography variant="h2" >
                            {game.title}
                        </Typography>
                        <Typography variant="h6" align="left">
                            Description: {game.description}
                        </Typography>
                        <Stack direction="row" spacing={2} margin="2px" sx={{justifyContent: "space-between",
                            alignItems: "center"}}>
                            <Typography variant="subtitle1" align="left">
                                Genre: {genreName?.name}
                                <br/>
                                Created on: {game.creationDate}
                                <br/>
                                Number of wishlisters: {game.numberOfWishlists}
                                <br/>
                                Number of owners: {game.numberOfOwners}
                                <br/>
                                Platforms: {platformsName}
                                <br/>
                                Rating: {game.rating}
                                <br/>
                                Number of reviews: {gameReviews.length}
                            </Typography>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Stack direction="column" spacing={2} margin="2px" sx={{justifyContent: "space-between",
                                    alignItems: "center"}}>
                                <Typography variant="subtitle1">
                                    Creator: {game.creatorFirstName} {game.creatorLastName}
                                    <Avatar alt="Creator Image"
                                            sx={{ width: 100, height: 100 }}
                                            src={creatorImage.length !== 0 ? creatorImage : "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"} />

                                </Typography>
                                    <Typography variant="h3">
                                        ${game.price}
                                    </Typography>
                                </Stack>
                            </div>
                        </Stack>
                    </CardContent>
                    {parseInt(userId as string,10) === game.creatorId && (
                        <>
                    <CardActions>
                        <IconButton onClick={() => {
                            setOpenEditDialog(true)}}>
                            <Edit/>
                        </IconButton>
                        <IconButton onClick={() => {setOpenDeleteDialog(true)}}>
                            <Delete/>
                        </IconButton>
                    </CardActions>
                    <Dialog
                        open={openDeleteDialog}
                        onClose={handleDeleteDialogClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">
                            {"Delete game?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this game?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                            <Button variant="outlined" color="error" onClick={() => {
                                if(game) deleteGame()
                                handleDeleteDialogClose();
                            }} autoFocus>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={openEditDialog}
                        onClose={handleEditDialogClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {`Renaming "${game?.title}" to:`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <TextField id="outlined-basic" label="Title" variant="outlined"
                                   value={gamename} onChange={updateGamenameState} />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose}>Cancel</Button>
                    <Button variant="outlined" color="error" onClick={() => {
                        if (game) editGame()
                        handleEditDialogClose();
                    }} autoFocus>
                        Save changes
                    </Button>
                </DialogActions>
            </Dialog>
                        </>
                    )}
                </Card>
            {/*</Paper>*/}
        </div>
            </>
    )
}
export default Game