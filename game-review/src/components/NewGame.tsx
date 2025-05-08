import LogInNavBar from "./LogInNavBar";
import {
    Button,
    Card,
    Checkbox,
    FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel,
    Grid,
    InputLabel,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    TextField
} from "@mui/material";
import React from "react";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import {rootUrl} from "../base.routes";
import CSS from "csstype";
import {Alert} from "react-bootstrap";
import {useUserStore} from "../store";

type PlatformCheckedState = {
    id: number;
    name: string;
    isSelected: boolean;
}
const NewGame = () => {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [genre, setGenre] = React.useState('Genre');
    const [errorMessage, setErrorMessage] = React.useState("");
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [allGenres, setGenres] = React.useState<Genre[]>([]);
    const [allPlatforms, setAllPlatforms] = React.useState<PlatformCheckedState[]>([]);
    const authorization = useUserStore();
    const token = authorization.token;
    const errorChecked = allPlatforms.filter(p => p.isSelected).length < 1;

    const onCreateGame = async () => {
        try {
            await axios.post("http://localhost:4941" + rootUrl + "/games", {
                headers: {
                    "X-Authorization": token
                }
            })
        }catch(error: any) {
            setErrorFlag(true);
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.toString());
            }
        }
    }

    React.useEffect(() => {
        getGenres();
        getPlatforms();
    }, [allGenres.length])

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
                setGenres(response.data.map((p: Platform) => ({...p, checked: false })));
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
                setAllPlatforms(response.data);
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            })
    }
    const onSubmit = async () => {

    }
    const handleSelectGenreChange = (event: SelectChangeEvent) => {
        setGenre(event.target.value as string);
    };

    const updateTitleState = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setTitle(e.currentTarget.value);
    }
    const updateDescriptionState = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setTitle(e.currentTarget.value);
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
        height: "800px",
        width: "80%",
        margin: "10px",
        padding: "0px",
        // backgroundColor: "lightcyan",
    }
    return (
        <>
            {console.log("genres: ",genre)}
            <LogInNavBar/>
            {errorFlag && <Alert variant="danger">{errorMessage}</Alert>}
            <Card sx={{ ...creatCardStyles, maxHeight: 'inherit', maxWidth: 'inherit', p: 2 }} >
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid size={6}>
                    <FormControl fullWidth sx={{ my: 2}} variant="outlined">
                    <TextField
                        required
                        type="text"
                        id="title-required"
                        label="Title"
                        onChange={updateTitleState}
                        sx={{ my: 2}}
                    />
                    <TextField
                        multiline
                        type="text"
                        id="description-required"
                        rows={8}
                        label="Description"
                        onChange={updateDescriptionState}
                        sx={{ my: 2}}
                    />
                    </FormControl>
                        <FormControl sx={{ m: 1, width: 200, justifyContent: 'left', alignItems: 'left' }}>
                            <InputLabel id="select-genre">Genre</InputLabel>
                            <Select
                                sx={{ my: 2}}
                                labelId="select-genre"
                                id="select-genre"
                                value={allGenres.map(g=>g.name).includes(genre) ? genre : ''}
                                onChange={handleSelectGenreChange}
                                MenuProps={MenuProps}
                            >
                                { allGenres.map(genre => (
                                    <MenuItem value={genre.genreId}>{genre.name}</MenuItem>
                                ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                        <Grid size={6}>
                            <FormControl
                                required
                                sx={{ m: 3 }}
                                variant="outlined"
                            >
                                <FormLabel color="info">Platform compatible: </FormLabel>
                                {errorFlag && (
                                    <FormLabel component="legend">Choose at least one platform</FormLabel>
                                )}
                                {allPlatforms.length > 0 && (
                                    <FormGroup>
                                        {allPlatforms.map((p) => (
                                            <FormControlLabel
                                                key={p.id}
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
                            </FormControl>
                        </Grid>
                    </Grid>
                <button type="button" className="btn btn-success" onClick={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}>Create Game
                </button>
            </Card>
        </>
    )
}
export default NewGame;