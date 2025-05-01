import React from "react";
import {useGameStore} from "../store";
import axios from "axios";
import CSS from 'csstype';
import {
    Card, CardActions, CardContent, CardMedia, IconButton, Typography,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, Stack, Link, Avatar
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import {rootUrl} from "../base.routes";
import {NavLink} from "react-router-dom";

interface IGameProps {
    game: Game
    genres: Genre[]
}
const GameListObject = (props: IGameProps) => {
    const [game] = React.useState<Game> (props.game);
    const [genres] = React.useState<Genre[]>(props.genres);
    const [platforms, setPlatforms] = React.useState<Platform[]>([]);
    const [gamename, setgamename] = React.useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [image, setImage] = React.useState("");
    const deleteGameFromStore = useGameStore(state => state.removeGame);
    const editGameFromStore = useGameStore(state => state.editGame);
    const [creatorImage, setCreatorImage] = React.useState("");
    const gameGenre = genres.find(g => g.genreId === game.genreId);
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
        axios.delete('http://localhost:4941'+rootUrl+'/games/' + game.gameId)
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
    React.useEffect(()=> {
        axios.get('http://localhost:4941'+rootUrl+'/users/' + game.creatorId.toString() + '/image', {
            responseType: 'blob',
        })
            .then((response) => {
                const imgUrl = URL.createObjectURL(response.data);
                setCreatorImage(imgUrl);
            }).catch((error) => {
            console.error("Failed to load image", error);
        });
    }, [game.creatorId]);

    React.useEffect(() => {
        axios.get('http://localhost:4941'+rootUrl+'/games/' + game.gameId + '/image', {
            responseType: 'blob',
        })
            .then((response) => {
                const imgUrl = URL.createObjectURL(response.data);
                setImage(imgUrl);
        }).catch((error) => {
            console.error("Failed to load image", error);
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
        <Card sx={gameCardStyles}>
            <CardMedia
                component="img"
                height="300"
                width="200"
                sx={{objectFit:"cover"}}
                // image="https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"
                image={image}
                alt="Auction hero"
            />
            <CardContent>
                <Typography variant="h6">
                    <NavLink to={rootUrl+'/games/' + game.gameId} end>
                        {game.title}
                    </NavLink>
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Typography variant="subtitle2" align="left">
                        Genres: {gameGenre?.name}
                        <br/>
                        Platforms: {platformsName}
                        <br/>
                        Creator: {game.creatorFirstName} {game.creatorLastName}
                        <br/>
                        Created on : {game.creationDate}
                    </Typography>
                    <div>
                        <Typography variant="h6" align="right">
                            ${game.price}
                        </Typography>
                        <Avatar alt="Creator Image" src={creatorImage.length !== 0 ? creatorImage : "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"} />
                    </div>
                </Stack>
            </CardContent>
            <CardActions>
                <IconButton onClick={() => {setOpenEditDialog(true)}}>
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
        </Card>
    )
}
export default GameListObject