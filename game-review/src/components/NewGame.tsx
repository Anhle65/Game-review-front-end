import LogInNavBar from "./LogInNavBar";
import {
    Card,
    CardContent, CardMedia,
    Checkbox,
    FormControl, FormControlLabel, FormGroup, FormLabel,
    Grid,
    InputLabel,
    ListItemIcon,
    Select,
    SelectChangeEvent,
    TextField
} from "@mui/material";
import React from "react";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import {rootUrl} from "../base.routes";
import CSS from "csstype";
import {Alert} from "react-bootstrap";
import {useUserStore} from "../store";
import {useNavigate, useParams} from "react-router-dom";
import AttachMoneyTwoToneIcon from '@mui/icons-material/AttachMoneyTwoTone';
const NewGame = () => {
    const {id} = useParams();
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState(" ");
    const [creatorId, setCreatorId] = React.useState(0);
    const [genre, setGenre] = React.useState('Genre');
    const [errorMessage, setErrorMessage] = React.useState("");
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [allGenres, setGenres] = React.useState<Genre[]>([]);
    const [allPlatforms, setAllPlatforms] = React.useState<PlatformCheckedState[]>([]);
    const [price, setPrice] = React.useState('0');
    const authorization = useUserStore();
    const token = authorization.token;
    const navigate = useNavigate();
    const errorChecked = allPlatforms.filter(p => p.isSelected).length < 1;
    const [image, setImage] = React.useState('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const onCreateGame = async () => {
        console.log("Chosen platforms: ", allPlatforms.filter(p => p.isSelected));
        console.log("Chosen platforms id: ", allPlatforms.filter(p => p.isSelected).map(i => i.platformId));
        // if(!errorChecked) {
            try {
                const gamePost = await axios.post("http://localhost:4941" + rootUrl + "/games", {
                    title: title,
                    description: description,
                    creationDate: new Date(),
                    genreId: parseInt(genre, 10),
                    price: parseInt(price, 10)*100,
                    platformIds: allPlatforms.filter(p => p.isSelected).map(i => parseInt(String(i.platformId), 10))
                }, {
                    headers: {
                        "X-Authorization": token
                    }
                })
                const createdId = gamePost.data["gameId"]
                console.log("created data: ", gamePost);
                console.log("created id: ", createdId);
                if(imageFile) {
                    await axios.put("http://localhost:4941" + rootUrl + "/games/" + createdId + "/image", imageFile, {
                        headers: {
                            "X-Authorization": token,
                            "Content-Type": imageFile?.type,
                        }
                    })
                }
                navigate('/games');
            } catch (error: any) {
                setErrorFlag(true);
                if (axios.isAxiosError(error)) {
                    setErrorMessage(error.message.toString());
                }
            }
        // } else {
        //     setErrorFlag(true);
        // }
    }
    const onUpdateGame = async () => {
        try{
            await axios.patch("http://localhost:4941" + rootUrl + "/games/" + id, {
                gameId: id,
                title: title,
                description: description,
                genreId: parseInt(genre, 10),
                price: parseInt(price, 10)*100,
                platformIds: allPlatforms.filter(p => p.isSelected).map(i => parseInt(String(i.platformId), 10))
            }, {
                headers: {
                    "X-Authorization": token
                }
            })
            if(imageFile) {
                await axios.put("http://localhost:4941" + rootUrl + "/games/" + id + "/image", imageFile, {
                    headers: {
                        "X-Authorization": token,
                        "Content-Type": imageFile?.type,
                    }
                })
            }
            navigate('/games/' + id);
        } catch (error) {
            setErrorFlag(true);
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.message.toString());
            }
            setErrorMessage("Unexpected error");
        }
    }
    React.useEffect(() => {
        getGenres();
        getPlatforms();
        if(id) {
            getGame().then( (res) => {
                console.log("Game: ", res);
                    setTitle(res.title);
                    setDescription(res.description);
                    setCreatorId(res.creatorId);
                    setGenre(res.genreId.toString());
                    setPrice((res.price /100).toString());
                    setAllPlatforms(prevPlatforms =>
                        prevPlatforms.map(platform => ({
                            ...platform,
                            isSelected: res.platformIds.includes(platform.platformId)
                        })))
                }
            );
            getGameImage();
        } else {
            setTitle("");
            setDescription("");
            setGenre('');
            setPrice('0');
            setAllPlatforms(prevPlatforms =>
                prevPlatforms.map(platform => ({
                    ...platform,
                    isSelected: false
                })))
            setImage('');
            setImageFile(null);
        }
    }, [])

    const getGameImage = async () => {
        await axios.get("http://localhost:4941" + rootUrl + "/games/" + id + "/image", {
            responseType: 'blob',
        })
            .then((response) => {
                const imgUrl = URL.createObjectURL(response.data);
                setImage(imgUrl);
            }, (error) => {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 404) {
                        setErrorFlag(false);
                    } else {
                        setErrorFlag(true);
                        setErrorMessage(error.message.toString());
                    }

                }

            })
    }
    const getGame = async () => {
        const gameResponse = await axios.get("http://localhost:4941" + rootUrl + "/games/" + id);
        return gameResponse.data;
    }
    const handlePlatformSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setAllPlatforms((prev) =>
            prev.map((p) =>
                p.name === name ? { ...p, isSelected: checked } : p
            )
        );
    };

    const getGenres = async () => {
        await axios.get('http://localhost:4941'+ rootUrl + '/games/genres')
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setGenres(response.data.map((g: Genre) => ({...g, checked: false })));
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            })
    }

    const getPlatforms = async () => {
        await axios.get('http://localhost:4941'+ rootUrl + '/games/platforms')
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                const platformsWithSelection = response.data.map((platform: any) => ({
                    ...platform,
                    isSelected: false
                }));
                console.log("platformsWithSelection: ", platformsWithSelection);
                setAllPlatforms(platformsWithSelection);
                console.log("platforms: ", allPlatforms);
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.message.toString());
            })
    }
    const handleSelectGenreChange = (event: SelectChangeEvent) => {
        setGenre(event.target.value as string);
    };

    const updateTitleState = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setTitle(e.currentTarget.value);
    }
    const updatePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setPrice(e.currentTarget.value);
    }
    const updateDescriptionState = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setDescription(e.currentTarget.value);
    }
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 200,
            },
        },
    };
    const creatCardStyles: CSS.Properties = {
        display: "inline-block",
        minHeight: "800px",
        width: "90%",
        margin: "10px",
        padding: "0px",
        // backgroundColor: "lightcyan",
    }
    return (
        <>
            {console.log("genres: ",genre)}
            <LogInNavBar/>
            {errorFlag && <Alert variant="danger">{errorMessage}</Alert>}
            <Card sx={{...creatCardStyles, maxHeight: 'inherit', maxWidth: 'inherit', p: 2}}>
                <h1>
                    Game Information
                </h1>
                <Grid container rowSpacing={2} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                    <Grid size={6}>
                        <FormControl fullWidth sx={{my: 2}} variant="outlined">
                            <TextField
                                required
                                type="text"
                                id="title-required"
                                label="Title"
                                onChange={updateTitleState}
                                value={title}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                                sx={{my: 2}}
                            />
                            <TextField
                                multiline
                                type="text"
                                id="description-required"
                                rows={8}
                                label="Description"
                                value={description}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                                onChange={updateDescriptionState}
                                sx={{my: 2}}
                            />
                        </FormControl>
                        <FormControl
                            required
                            sx={{m: 3, justifyContent: 'flex-end', alignItems: 'flex-end'}}
                            variant="outlined"
                        >
                            <Grid container columnSpacing={{xs: 1, sm: 2, md: 3}}
                                  sx={{justifyContent: 'left', alignItems: 'left'}}>
                                <Grid size={6} sx={{justifyContent: 'left', alignItems: 'left'}}>
                                    <FormControl sx={{m: 1, width:'100.px'}}>
                                        <InputLabel id="select-genre">Genre</InputLabel>
                                        <Select
                                            sx={{my: 1, width:'100.px'}}
                                            labelId="select-genre"
                                            id="select-genre"
                                            value={allGenres.map(g => g.genreId).includes(parseInt(genre, 10)) ? genre : ''}
                                            onChange={handleSelectGenreChange}
                                            MenuProps={MenuProps}
                                        >
                                            {allGenres.map(genre => (
                                                <MenuItem value={genre.genreId}>{genre.name}</MenuItem>
                                            ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <ListItemIcon>
                                        <AttachMoneyTwoToneIcon fontSize="large"/>
                                        <TextField
                                        type="number"
                                        id="price-required"
                                        label="Price"
                                        onChange={updatePrice}
                                        value={price}
                                        placeholder='0'
                                        // sx={{my: 2}}
                                    />
                                    </ListItemIcon>
                                </Grid>
                                <Grid size={6} sx={{justifyContent: 'center', alignItems: 'center'}}>
                                    <FormLabel style={{color: "gray"}} color="info">Platform compatible: </FormLabel>
                                    {allPlatforms.length > 0 && (
                                        <FormGroup>
                                            {allPlatforms.map((p) => (
                                                <FormControlLabel
                                                    key={p.platformId}
                                                    control={
                                                        <Checkbox
                                                            checked={p.isSelected ?? false}
                                                            onChange={handlePlatformSelectChange}
                                                            name={p.name}
                                                        />
                                                    }
                                                    label={p.name}
                                                />
                                            ))}
                                        </FormGroup>
                                    )}
                                    {allPlatforms.filter(p=>p.isSelected === true).length < 1 && (
                                        <FormLabel style={{color: "red"}} color='error'>Choose at least one platform</FormLabel>
                                    )}
                                </Grid>
                            </Grid>
                        </FormControl>
                    </Grid>
                    <Grid size={6}>
                        <input type="file" accept="image/png, image/jpeg, image/gif" onChange={(e) => {
                            if (e.target.files) {
                                setImage(URL.createObjectURL(e.target.files[0]));
                                setImageFile(e.target.files[0]);
                            }
                        }}/>
                        <CardMedia
                            component="img"
                            sx={{objectFit: "cover"}}
                            image={image.length > 0 ? image : "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"}
                        />
                    </Grid>
                </Grid>
                {creatorId !== 0 && (
                    <button type="button" className="btn btn-success" onClick={(e) => {
                        e.preventDefault();
                        onUpdateGame();
                    }}>Update Game
                    </button>
                )}
                {creatorId === 0 && (
                    <button type="button" className="btn btn-success" onClick={(e) => {
                        e.preventDefault();
                        onCreateGame();
                    }}>Create Game
                    </button>
                )}
            </Card>
        </>
    )
}
export default NewGame;