import React from "react";
import {useGameStore} from "../store";
import axios from "axios";
import CSS from 'csstype';
import {
    Card, CardActions, CardContent, CardMedia, IconButton, Typography,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import {rootUrl} from "../base.routes";

interface IGameProps {
    game: Game
}
const GameListObject = (props: IGameProps) => {
    const [game] = React.useState<Game> (props.game);
    const [gamename, setgamename] = React.useState("");
    const [imageUrl, setImageUrl] = React.useState<string>("");
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const deleteGameFromStore = useGameStore(state => state.removeGame);
    const editGameFromStore = useGameStore(state => state.editGame);
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
    const getGameImage = () => {
        axios.get('http://localhost:4941'+rootUrl+'/games/' + game.gameId + '/image')
            .then(() => {
                editGameFromStore(game, gamename);
            })
    }
    const gameCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "328px",
        width: "300px",
        margin: "10px",
        padding: "0px"
    }
    return(
        <Card sx={gameCardStyles}>
            <CardMedia
                component="img"
                height="200"
                width="200"
                sx={{objectFit:"cover"}}
                image={game.image_filename}
                alt="Auction hero"
            />
            <CardContent>
                <Typography variant="h4">
                    {game.gameId} {game.title}
                </Typography>
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