import LogInNavBar from "./LogInNavBar";
import {Card, FormControl, InputLabel, Paper, Select, SelectChangeEvent, Stack, TextField} from "@mui/material";
import React from "react";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import {rootUrl} from "../base.routes";

const NewGame = () => {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [genre, setGenre] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState("");
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [allGenres, setGenres] = React.useState<Genre[]>([]);
    const [allGenresName, setAllGenresName] = React.useState<string[]>([]);

    React.useEffect(() => {
        getGenres();
        setAllGenresName(allGenres.map(genre => genre.name));
    }, [allGenres.length])
    const getGenres = async () => {
        await axios.get('http://localhost:4941'+ rootUrl + '/games/genres')
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setGenres(response.data);
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            })

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
    return (
        <>
            {console.log("genres: ",genre)}
            <LogInNavBar/>
            <Stack alignItems="center" spacing={2}>
                <FormControl sx={{ mb: 1 }} variant="outlined">
                    <TextField
                        required
                        type="text"
                        id="title-required"
                        label="Title"
                        onChange={updateTitleState}
                        sx={{ my: 2 }}
                    />
                    <TextField
                        type="text"
                        id="description-required"
                        label="Description"
                        onChange={updateDescriptionState}
                        sx={{ my: 2 }}
                    />

                        <Select
                            sx={{ my: 2 }}
                            labelId="select-genre"
                            id="select-genre"
                            label="Genre"
                            value={genre}
                            onChange={handleSelectGenreChange}
                        >
                            { allGenresName.map(name => (
                                <MenuItem value={name}>{name}</MenuItem>
                            ))
                            }
                        </Select>
                </FormControl>
            </Stack>
        </>
    )
}
export default NewGame;