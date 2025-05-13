import React from "react";
import axios from "axios";
import CSS from 'csstype';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Stack,
    Avatar,
    Tooltip,
    Pagination, PaginationItem, Alert, AlertTitle, Fab
} from "@mui/material";
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';import {rootUrl} from "../base.routes";
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
import FavoriteIcon from "@mui/icons-material/Favorite";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import SimilarGame from "./SimilarGame";
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
    const [image, setImage] = React.useState("https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png");
    const [creatorImage, setCreatorImage] = React.useState("");
    const [genres, setGenre] = React.useState<Array<Genre>> ([]);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openAddReviewDialog, setOpenAddReviewDialog] = React.useState(false);
    const [openAddWishlistDialog, setOpenAddWishlistDialog] = React.useState(false);
    const [openAddOwnDialog, setOpenAddOwnDialog] = React.useState(false);
    const [genreId, setGenreId] = React.useState(0);
    const [creatorId, setCreatorId] = React.useState(0);
    const genreName = genres.find(g => g.genreId === game.genreId)
    const [platforms, setPlatforms] = React.useState<Platform[]>([]);
    const allPlatforms = game.platformIds.map(id => platforms.find(p => p.platformId === id)?.name)
        .filter((name): name is string => !!name);  //Only keep values where name is truthy — i.e., a non-empty string, and not undefined or null.
    const platformsName = allPlatforms.join(', ');
    const [inputComment, setInputComment] = React.useState(' ');
    const [inputRating, setInputRating] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [isAddWishlist, setIsAddWishlist] = React.useState(true);
    const [openWlMessage, setOpenWlMessage] = React.useState(false);
    const [openCreateMessage, setOpenCreateMessage] = React.useState(false);
    const [openEditMessage, setOpenEditMessage] = React.useState(false);
    const [alreadyOwned, setAlreadyOwned] = React.useState(false);
    const [openOwnMessage, setOpenOwnMessage] = React.useState(false);
    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    }
    const handleAddReviewDialogClose = () => {
        setOpenAddReviewDialog(false);
    }
    const handleAddWishlistDialogClose = () => {
        setOpenAddWishlistDialog(false);
    }
    const handleInputComment = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputComment(event.target.value);
        setErrorFlag(false);
    };
    const handlePaginationClick = (value: number) => {
        setCurrentPage(value);
    }
    const onSubmitForm = async () => {
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
    const deleteGame = () => {
        axios.delete('http://localhost:4941'+rootUrl+'/games/' + id, {
            headers: {
                "X-Authorization": token
            }})
            .then(() => {
                navigate('/users/'+userId+'/myGames')
            })
    }

    const editGame = () => {
        navigate(`/games/${id}/edit`);
    }
    const createGame = () => {
        window.scrollTo({top:0});
        navigate(`/games/create`);
    }
    const handleLogin = () => {
        navigate("/users/login/");
    }
    const getWishlistGame = async () => {
        await axios.get("http://localhost:4941"+rootUrl+'/games?wishlistedByMe=true', {
            headers: {
                "X-Authorization": token
            }
        })
            .then((response) => {
                console.log("Wishlist game", response.data);
                const gameId = response.data['games'].map((g:any) =>g.gameId);
                console.log("Wishlist game id ", gameId);
                if(gameId.includes(parseInt(id as string,10))){
                    setIsAddWishlist(false);
                }
                return gameId;
            })
    }
    const getOwnedGame = async () => {
        await axios.get("http://localhost:4941"+rootUrl+'/games?ownedByMe=true', {
            headers: {
                "X-Authorization": token
            }
        })
            .then((response) => {
                console.log("Owned game", response.data);
                const gameId = response.data['games'].map((g:any) =>g.gameId);
                console.log("Owned game id ", gameId);
                if(gameId.includes(parseInt(id as string,10))){
                    setAlreadyOwned(true);
                }
                return gameId;
            })
    }
    const onClickOwnedButton = () => {
        if (!userId) {
            setOpenAddOwnDialog(true);
            return;
        }

        if (alreadyOwned) {
            removeFromOwn();
            setAlreadyOwned(false);
        } else {
            addToOwn();
            setAlreadyOwned(true);
            setIsAddWishlist(true);
        }
    };
    const addToWishlist = async () => {
        await axios.post("http://localhost:4941"+rootUrl+'/games/'+id+'/wishlist', {
            'gameId': id,
            'authId': userId
        }, {
            headers: {
                'X-Authorization': token
            }
        }).then((res)=>{
            setIsAddWishlist(false)
            return res.data.gameId;
        })
    }
    const addToOwn = async () => {
        await axios.post("http://localhost:4941"+rootUrl+'/games/' + id + '/owned', {
            'gameId': id,
            'authId': userId
        }, {
            headers: {
                'X-Authorization': token
            }
        }).then((res)=>{
            setAlreadyOwned(true);
            return res.data.gameId;
        })
    }
    const removeFromOwn = async () => {
        await axios.delete("http://localhost:4941"+rootUrl+'/games/' + id + '/owned', {
            headers: {
                'X-Authorization': token
            }
        }).then((res)=>{
            setAlreadyOwned(false);
            return res.data.gameId;
        })
    }
    const removeFromWishlist = async () => {
        await axios.delete("http://localhost:4941"+rootUrl+'/games/'+id+'/wishlist', {
            headers: {
                'X-Authorization': token
            }
        }).then((res)=>{
            setIsAddWishlist(true);
            return res.data.gameId;
        })
    }
    const onClickWishlistButton = async () => {
        if(userId) {
            // setAddWishlistState(!isAddWishlist);
            if (isAddWishlist) {
                await addToWishlist();
            } else {
                await removeFromWishlist();
            }
        }else {
            setOpenAddWishlistDialog(true);
        }
    }
    React.useEffect(() => {
        if(userId) {
            getOwnedGame();
            getWishlistGame();
        }
        const getGame = () => {
            axios.get('http://localhost:4941' +rootUrl+'/games/' + id)
                .then((response) => {
                    setGame(response.data);
                    setGenreId(response.data.genreId);
                    setCreatorId(response.data.creatorId);
                })
            }
        getGame();
    }, [])
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
                    setErrorFlag(false);
                    setErrorMessage('');
                    setCreatorImage(imgUrl);
                }).catch((error) => {
                    if(axios.isAxiosError(error)) {
                        if (error.response?.status !== 404) {
                            setErrorFlag(true);
                            setErrorMessage('Unexpected error');
                        }
                    }
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
                setErrorFlag(false);
                const imgUrl = URL.createObjectURL(response.data);
                setImage(imgUrl);
            }).catch((error) => {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    setErrorFlag(false);
                } else {
                    setErrorFlag(true);
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
                                    ${game.price/100}
                                </Typography>
                            </Stack>
                        </div>
                    </Stack>
                    <Stack direction='row' sx={{ justifyContent: "space-between", alignItems: "center"}}>
                    <Typography variant="h6" align="left">
                        Reviews({gameReviews.length}):
                    </Typography>
                        <div>
                            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                        <Tooltip open={openCreateMessage} onClose={()=>setOpenCreateMessage(false)} onOpen={()=>setOpenCreateMessage(true)}
                                 title="Create new game">
                            <Fab color="primary" aria-label="add" onClick={createGame}>
                                <AddIcon />
                            </Fab>
                        </Tooltip>
                        {parseInt(userId as string,10) !== game.creatorId && (
                            <>
                                <Tooltip open={openOwnMessage} onClose={() => setOpenOwnMessage(false)}
                                       onOpen={() => setOpenOwnMessage(true)}
                                       title={alreadyOwned ? "Remove game from owned" : "Add game to owned"}>
                                    <Fab aria-label="like" color={alreadyOwned ? 'error' : 'default'} onClick={() => {
                                        onClickOwnedButton();
                                    }}>
                                        <BookmarkBorderOutlinedIcon/>
                                    </Fab>
                                </Tooltip>
                                <Tooltip open={openWlMessage} onClose={() => setOpenWlMessage(false)}
                                               onOpen={() => setOpenWlMessage(true)}
                                               title={(isAddWishlist && !alreadyOwned) ? "Add game into wishlist" : "Remove game from wishlist"}>
                                    <Fab aria-label="like" disabled={alreadyOwned} color={(isAddWishlist && !alreadyOwned)? 'default' : 'error'} onClick={() => {
                                        onClickWishlistButton();
                                    }}>
                                        <FavoriteIcon/>
                                </Fab>
                            </Tooltip></>
                        )}
                        {parseInt(userId as string,10) === game.creatorId && (
                            <>
                                <Tooltip open={openEditMessage} onClose={()=>setOpenEditMessage(false)} onOpen={()=>setOpenEditMessage(true)}
                                         title="Edit game">
                                    <Fab color="success" aria-label="edit" onClick={editGame}>
                                        <EditIcon />
                                    </Fab>
                                </Tooltip>
                                <Tooltip open={openWlMessage} onClose={()=>setOpenWlMessage(false)} onOpen={()=>setOpenWlMessage(true)}
                                         title="Delete game">
                                    <Fab color="error" aria-label="delete" onClick={() => {
                                        setOpenDeleteDialog(true)}}>
                                        <DeleteIcon />
                                    </Fab>
                                </Tooltip>
                            </>
                        )}
                            </Box>
                        </div>
                    </Stack>
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
                            <Button variant="outlined" color="success" onClick={handleLogin} autoFocus>
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
                            <AlertTitle>{errorMessage}</AlertTitle>
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
                            </Form.Select>
                        </Form.Group>
                        <Button type="submit" autoFocus color='info' onClick={(e) => {
                            e.preventDefault()
                            if (!userId)
                                setOpenAddReviewDialog(true)
                            else
                                onSubmitForm()
                        }}>Post review</Button>
                    </Form>
                </CardContent>
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
                        open={openAddWishlistDialog}
                        onClose={handleAddWishlistDialogClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title" color="warning">
                            Wishlist game
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                You need to log in to wishlist game.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleAddWishlistDialogClose}>Cancel</Button>
                            <Button variant="outlined" color="success" onClick={handleLogin} autoFocus>
                                Login
                            </Button>
                        </DialogActions>
                    </Dialog>
                <Dialog
                    open={openAddOwnDialog}
                    onClose={()=>setOpenAddOwnDialog(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title" color="warning">
                        Own game
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            You need to log in to own game.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>setOpenAddOwnDialog(false)}>Cancel</Button>
                        <Button variant="outlined" color="success" onClick={handleLogin} autoFocus>
                            Login
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </div>
            {(creatorId || genreId) && (
                <SimilarGame creatorId={creatorId} genreId={genreId} />
            )}
            </>
    )
}
export default Game