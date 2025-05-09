import React from "react";
import axios from "axios";
import CSS from 'csstype';
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    IconButton,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    Stack,
    Avatar,
    Pagination, PaginationItem, Alert, AlertTitle, Fab
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import {rootUrl} from "../base.routes";
import { useNavigate, useParams} from "react-router-dom";
import LogInNavBar from "./LogInNavBar";
import LogoutNavBar from "./LogoutNavBar";
import GameReviewObject from "./GameReviewObject";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {Form} from "react-bootstrap";
import {useUserStore} from "../store";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import NavigationIcon from "@mui/icons-material/Navigation";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
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
    const authorization = useUserStore();
    const userId = authorization.userId;
    const token = authorization.token;
    const rating = [1,2,3,4,5,6,7,8,9,10];
    const navigate = useNavigate();
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [gameReviews, setGameReviews] = React.useState<Review[]>([]);
    const [gamename, setgamename] = React.useState("");
    const [image, setImage] = React.useState("");
    const [creatorImage, setCreatorImage] = React.useState("");
    const [genres, setGenre] = React.useState<Array<Genre>> ([]);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openAddReviewDialog, setOpenAddReviewDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const genreName = genres.find(g => g.genreId === game.genreId)
    const [platforms, setPlatforms] = React.useState<Platform[]>([]);
    const allPlatforms = game.platformIds.map(id => platforms.find(p => p.platformId === id)?.name)
        .filter((name): name is string => !!name);  //Only keep values where name is truthy — i.e., a non-empty string, and not undefined or null.
    const platformsName = allPlatforms.join(', ');
    const [inputComment, setInputComment] = React.useState(' ');
    const [inputRating, setInputRating] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);
    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    }
    const handleAddReviewDialogClose = () => {
        setOpenAddReviewDialog(false);
    }
    const handleInputComment = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputComment(event.target.value);
        setErrorFlag(false);
    };
    const handlePaginationClick = (value: number) => {
        setCurrentPage(value);
    }
    const onSubmitForm = async () => {
        console.log("Rating number: "+inputRating);
        console.log("Comment: "+inputComment);
        if(!userId) {

        }
        try {
            if (inputRating === 0 || isNaN(inputRating)) {
                setErrorFlag(true);
                setErrorMessage("Please give a rating number");
            } else {
                await axios.post("http://localhost:4941" + rootUrl + '/games/' + id + '/reviews', {
                    "rating": inputRating,
                    "review": inputComment
                }, {
                    headers: {
                        "X-Authorization": token
                    }
                })
                window.location.reload();
            }
        } catch (error) {
            setErrorFlag(true);
            if(axios.isAxiosError(error)) {
                if (error.response?.status === 403) {
                    if (parseInt(userId as string,10) === game.creatorId) {
                        setErrorMessage("Cannot post a review on your own game.")
                    } else
                        setErrorMessage("Cannot post more than one review on a game.");
                }
                if (error.response?.status === 400) {
                    setErrorMessage("Rating is between 1 to 10");
                }
            } else {
                setErrorMessage("Unexpected error");
            }
        }
    }
    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
    }
    const deleteGame = () => {
        console.log("Game id: " + id);
        axios.delete('http://localhost:4941'+rootUrl+'/games/' + id, {
            headers: {
                "X-Authorization": token
            }})
            .then(() => {
                // deleteGameFromStore(game);
            })
    }
    const updateGamenameState = (event: React.ChangeEvent<HTMLInputElement>) => {
        setgamename(event.target.value)
    }
    const editGame = () => {
        // axios.patch('http://localhost:4941'+rootUrl+'/games/' + game.gameId, {"gamename": gamename})
        //     .then(() => {
        //         // editGameFromStore(game, gamename);
        //     })
        navigate(`/games/${id}/edit`);
    }

    const handleAddReview = () => {
        if (userId) {
            navigate("/games/" + id + "/review/");
        } else {
            navigate("/users/login/");
        }
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
        if(game.creatorId !== 0) {
            axios.get('http://localhost:4941' + rootUrl + '/users/' + game.creatorId + '/image', {
                responseType: 'blob',
            })
                .then((response) => {
                    const imgUrl = URL.createObjectURL(response.data);
                    setCreatorImage(imgUrl);
                }).catch((error) => {
                console.error("Failed to load image", error);
            });
        }
    }, [game.creatorId]);
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
    const gameReview_rows = () => gameReviews.slice((currentPage - 1) * 3, currentPage * 3).map((rv: Review) => <GameReviewObject key={`${game.gameId}-${rv.reviewerId}`} gameReview={rv} />);
    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        maxWidth: "60%",
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
                            Created on: {new Date(game.creationDate).toLocaleDateString()}
                            <br/>
                            Number of wishlisters: {game.numberOfWishlists}
                            <br/>
                            Number of owners: {game.numberOfOwners}
                            <br/>
                            Platforms: {platformsName}
                            <br/>
                            Rating: {game.rating}
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
                    <Typography variant="h6" align="left">
                        Reviews({gameReviews.length}):
                    </Typography>
                    <br/>
                    <div style={{display: "inline-block", justifyContent: 'left', alignItems: 'left'}}>
                        {gameReview_rows()}
                    </div>
                    <Dialog
                        open={openAddReviewDialog}
                        onClose={handleAddReviewDialogClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title" color="warning">
                            Write a review
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                You need to log in to write review for this game.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleAddReviewDialogClose}>Cancel</Button>
                            <Button variant="outlined" color="success" onClick={handleAddReview} autoFocus>
                                Login
                            </Button>
                        </DialogActions>
                    </Dialog>
                    {gameReviews.length > 3 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Pagination
                                count={Math.ceil(gameReviews.length / 3)}
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
                    )}
                    {errorFlag ? (
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>
                    ) : null}
                    <Form>
                        {/*<fieldset disabled>*/}
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="textInput">Comment: </Form.Label>
                            <Form.Control id="textInput" as="textarea" rows={3} placeholder="Comment" onChange={handleInputComment}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="select">Rating: </Form.Label>
                            <Form.Select id="select" onChange={(e)=> setInputRating(parseInt(e.target.value, 10))}>
                                <option value = "Choose...">Choose...</option>
                                {rating.map(i =>
                                    <option value={i}>
                                        {i}
                                    </option>
                                )}
                                {/*{console.log("Rating: "+inputRating)}*/}
                            </Form.Select>
                        </Form.Group>
                        <Button type="submit" onClick={(e) => {
                            e.preventDefault()
                            if (!userId)
                                setOpenAddReviewDialog(true)
                            else
                                onSubmitForm()
                        }}>Post review</Button>
                        {/*</fieldset>*/}
                    </Form>
                </CardContent>
                {parseInt(userId as string,10) === game.creatorId && (
                    <>
                        <CardActions>
                            <IconButton onClick={() => {
                                // setOpenEditDialog(true)
                                navigate(`/games/${id}/edit`);
                            }}>
                                <Edit/>
                            </IconButton>
                            <IconButton onClick={() => {
                                setOpenDeleteDialog(true)
                                // navigate(`/games/${id}/edit`);
                            }}>
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
                                {`Edit game "${game?.title}" information:`}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    <TextField id="outlined-basic" label="Title" variant="outlined"
                                               value={gamename} onChange={updateGamenameState} />
                                </DialogContentText>
                            </DialogContent>
                        </Dialog>
                    </>
                )}
                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                    <Fab color="primary" aria-label="add">
                        <AddIcon />
                    </Fab>
                    {parseInt(userId as string,10) === game.creatorId && (
                        <>
                            <Fab color="success" aria-label="edit" onClick={editGame}>
                                <EditIcon />
                            </Fab>
                            <Fab color="error" aria-label="delete" onClick={() => {
                                setOpenDeleteDialog(true)}}>
                                <DeleteIcon />
                            </Fab>
                        </>
                    )}
                    {parseInt(userId as string,10) !== game.creatorId && (
                        <Fab aria-label="like" color='error'>
                            <FavoriteIcon />
                        </Fab>
                    )}
                </Box>
            </Card>
        </div>
            </>
    )
}
export default Game