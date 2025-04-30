import React from "react";
import {useGameStore} from "../store";
import axios from "axios";
import CSS from 'csstype';
import {
    Card, CardActions, CardContent, CardMedia, IconButton, Typography,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, Stack
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import {rootUrl} from "../base.routes";

interface IGameProps {
    game: Game
    genres: Genre[]
}
const GameListObject = (props: IGameProps) => {
    const [game] = React.useState<Game> (props.game);
    const [genres] = React.useState<Genre[]>(props.genres);
    const [gamename, setgamename] = React.useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const deleteGameFromStore = useGameStore(state => state.removeGame);
    const editGameFromStore = useGameStore(state => state.editGame);
    const gameGenre = genres.find(g => g.genreId === game.genreId);
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
                image="https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"
                alt="Auction hero"
            />
            <CardContent>
                <Typography variant="h6">
                    {game.title}
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Typography variant="subtitle2" align="left">
                        Genres: {gameGenre?.name}
                        <br/>
                        Creator: {game.creatorFirstName} {game.creatorLastName}
                        <br/>
                        Created on : {game.creationDate}
                    </Typography>
                    <Typography variant="h6" align="right">
                        ${game.price}
                    </Typography>
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