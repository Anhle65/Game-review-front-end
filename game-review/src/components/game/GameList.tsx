import React, {ChangeEvent} from "react";
import axios from "axios";
import CSS from 'csstype';
import {
    Alert,
    AlertTitle,
    Autocomplete,
    Box, Checkbox, FormControlLabel, FormGroup, FormLabel,
    Input,
    Pagination,
    PaginationItem,
    Paper,
    Slider,
    Stack,
    TextField, Typography
} from "@mui/material";
import { rootUrl } from "../../base.routes";
import GameListObject from "./GameListObject";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from "@mui/icons-material/Search";
import LogInNavBar from "../LogInNavBar";
import LogoutNavBar from "../LogoutNavBar";
import {useUserStore} from "../../store";
import AttachMoneyTwoToneIcon from "@mui/icons-material/AttachMoneyTwoTone";
type GameParams = {
    params: Record<string, string | number | boolean | any[]>;
};
const GameList = ({params}: GameParams) => {
    const [games, setGames] = React.useState<Game[]>([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [characterSearching, setCharacterSearching] = React.useState("");
    const authorization = useUserStore();
    const userId = authorization.userId;
    const token = authorization.token;
    const optionSortBy = [{label:'CREATED_ASC', value: 'Oldest games'}, {label:'CREATED_DESC', value: 'Newest games'},
        {label:'ALPHABETICAL_ASC', value: 'A->Z'}, {label:'ALPHABETICAL_DESC', value: 'Z->A'},
        {label:'PRICE_ASC', value: 'Lowest price'}, {label:'PRICE_DESC', value: 'Highest price'},
        {label:'RATING_ASC', value: 'Low rating'}, {label:'RATING_DESC', value: 'Best rating'}];
    const [value, setValue] = React.useState('Oldest games');
    const [inputValue, setInputValue] = React.useState('');
    const [labelSorting, setLabelSorting] = React.useState('CREATED_ASC');
    const [allPlatforms, setAllPlatforms] = React.useState<PlatformCheckedState[]>([]);
    const [allGenres, setGenres] = React.useState<GenreSelectionState[]>([]);
    const [chosenPlatform, setChosenPlatforms] = React.useState<PlatformCheckedState[]>([]);
    const [chosenGenres, setChosenGenres] = React.useState<GenreSelectionState[]>([]);
    let filterParams = new URLSearchParams();
    const [maxPrice, setMaxPrice] = React.useState(100);
    const [maxPriceGame, setMaxPriceGame] = React.useState(0);
    Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((v) => filterParams.append(key, String(v)));
        } else {
            filterParams.append(key, String(value));
        }
    });
    let url = `http://localhost:4941${rootUrl}/games`;
    React.useEffect(()=>{
        const getGames = () => {
            axios.get(`http://localhost:4941${rootUrl}/games`)
                .then((res) => {
                    const highestPrice = Math.max(...res.data['games'].map((g: any) => g.price/100));
                    setMaxPriceGame(highestPrice);
                    setMaxPrice(highestPrice);
                })
        };
        getGames();
    }, [])
    const getGenres = async () => {
        await axios.get('http://localhost:4941'+ rootUrl + '/games/genres')
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                const genresState = response.data.map((g:any) => ({
                        ...g,
                        isSelected: false
                }))
                setGenres(genresState);
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            })
    }
    const handleGenresSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setGenres((prev) => {
            const updated = prev.map((g) =>
                g.name === name ? {...g, isSelected: checked} : g
            )
            setChosenGenres(updated.filter(g=>g.isSelected));
            return updated;
        });
    };
    const getPlatforms = async () => {
        await axios.get('http://localhost:4941'+ rootUrl + '/games/platforms')
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                const platformsWithSelection = response.data.map((platform: any) => ({
                    ...platform,
                    isSelected: false
                }));
                setAllPlatforms(platformsWithSelection);
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.message.toString());
            })
    }
    const handlePlatformSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setAllPlatforms((prev) => {
            const updated = prev.map((p) =>
                p.name === name ? { ...p, isSelected: checked } : p
            );
            setChosenPlatforms(updated.filter(p => p.isSelected));
            return updated;
        });
    };
    React.useEffect(() => {
        getPlatforms();
        getGenres();
    }, [])
    React.useEffect(() => {
        setCurrentPage(1);
        if(characterSearching.trim()) {
            filterParams.append('q', characterSearching);
        }
        filterParams.append('price', String(maxPrice*100));
        chosenGenres.forEach((genre) => {
            filterParams.append('genreIds', genre.genreId.toString())
        })
        chosenPlatform.forEach((platform) => {
            filterParams.append('platformIds', platform.platformId.toString())
        })
        filterParams.append('sortBy', labelSorting);
        if (filterParams.toString()) {
            url += `?${filterParams.toString()}`;
        }
        console.log("New url: ", url);
        const getGames = () => {
            axios.get(url,{headers: {
                "X-Authorization": token
                }})
                .then((response) => {
                    setErrorFlag(false);
                    setGames(response.data['games']);
                    setErrorMessage("");
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString() + " defaulting to old users changes app may not work as expected")
                })
        }
        getGames();
        }, [characterSearching, labelSorting, chosenPlatform, chosenGenres, maxPrice]
    )
    const handleSorting = (e:ChangeEvent<HTMLInputElement>, newValue: string| null) => {
        const label = optionSortBy.find(o => o.value === newValue)?.label;
        if(label && newValue) {
            setLabelSorting(label);
            setValue(newValue);
        } else {
            setValue('Oldest games')
            setLabelSorting('CREATED_ASC');
        }
    }
    const handlePaginationClick = (value: number) => {
        setCurrentPage(value);
        window.scrollTo({top:0});
    }
    const handleInputSearchingChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCharacterSearching(e.target.value)
    }
    const handleSliderChange = (event: Event, newValue: number) => {
        setMaxPrice(newValue);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMaxPrice(event.target.value === '' ? 0 : Math.round(parseFloat(event.currentTarget.value) * 100) / 100);
    };

    const handleBlur = () => {
        if (maxPrice < 0) {
            setMaxPrice(0);
        } else if (maxPrice > maxPriceGame) {
            setMaxPrice(maxPriceGame);
        }
    };
    const game_rows = () => games.slice((currentPage - 1) * 9, currentPage * 9).map((game: Game) => <GameListObject key={game.gameId + game.title} game={game}/>);
    const card: CSS.Properties = {
        padding: "1rem",
        display: "block",
        height: '100%',
    }
    return (
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
            {errorFlag ? (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>
            ) : null}
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginTop: 2,
            padding: '2rem',
            width: '100%',
            minWidth: { xs: "100%", sm: "100%", md: "1024px" },
            }}>
                <Stack direction="row" spacing={2}>
                <Paper elevation={3} style={card} sx={{display: 'flex', justifyContent: 'flex-start',
                    alignItems: 'flex-start'}}>
                    <Stack direction="row" spacing={2} sx={{justifyContent: 'space-between'}} padding='15px 20px 0 15px'>
                        <div>
                            <Stack direction='row'>
                                <SearchIcon fontSize='large'/>
                                <input type='text' style={{overflowY: "auto"}} placeholder="Search..."
                                       className="form-control" id="input" value={characterSearching} onChange={handleInputSearchingChange}/>
                            </Stack>
                        </div>
                        <Autocomplete
                            value={value}
                            onChange={(event: any, newValue: string| null) => handleSorting(event, newValue)}
                            inputValue={inputValue}
                            onInputChange={(event, newInputValue) => {
                                if (optionSortBy.some(o => o.value === newInputValue)) {
                                    setInputValue(newInputValue);
                                }
                            }}
                            id="sort-by-selection"
                            options={optionSortBy.map(o => o.value)}
                            sx={{minWidth:'40%', maxWidth: '50%'}}
                            renderInput={(params) => <TextField {...params} label="Sort by"/>}
                        />
                    </Stack>
                    <div style={{display: "flex", justifyContent: 'flex-start',
                        alignItems: 'flex-start'}}>
                        <Box sx={{
                            display: 'block',
                            maxWidth: { xs: '100%', sm: '100%', md: '1024px' },
                        }}>
                            {game_rows()}
                        </Box>
                    </div>
                    {games.length > 0 ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            <Pagination
                                page={currentPage}
                                count={Math.ceil(games.length / 9)}
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
                    ):(
                        (
                        <><Typography variant='h4'>No Game</Typography>
                            <Typography variant='h6'>
                        </Typography></>
                    )
                    )}
                </Paper>
                </Stack>
                <Box sx={{marginTop: 3, alignItems: 'center', width: "fit-content", display: "block"}}>
                    <FormLabel style={{color: "black", fontSize:'large'}} color="info">Advanced Filter:</FormLabel>
                    <br/>
                    <Typography sx={{justifyContent:'left'}} id="input-slider" gutterBottom>
                        Max price: $
                    </Typography>
                        <Stack direction='row' spacing={0.5} sx={{ justifyContent: 'flex-start', width: "fit-content", display: "block"}}>
                        <Slider
                            value={maxPrice}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                            valueLabelDisplay="auto"
                            max={maxPriceGame}
                        />
                            <Input
                                value={maxPrice}
                                size="small"
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                inputProps={{
                                    step: 10,
                                    min: 0,
                                    max: {maxPriceGame},
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Stack>
                    <br/>
                    <Box padding='20px 0 0 0'>
                    <FormLabel style={{color: "black", fontSize:'large'}} color="info">Platform compatible: </FormLabel>
                    </Box>
                    <Box padding='0 0 0 35px'>
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
                    </Box>
                    <FormLabel style={{color: "black", fontSize:'large', display: 'flex', padding:'0 0 0 15px'}} color="info">Genres: </FormLabel>
                    <Box padding='0 0 0 35px'>
                        {allGenres.length > 0 && (
                            <FormGroup>
                                {allGenres.map((g) => (
                                    <FormControlLabel
                                        key={g.genreId}
                                        control={
                                            <Checkbox
                                                checked={g.isSelected ?? false}
                                                onChange={handleGenresSelectChange}
                                                name={g.name}
                                            />
                                        }
                                        label={g.name}
                                    />
                                ))}
                            </FormGroup>
                        )}
                    </Box>
                </Box>
        </Box>
        </>
)

}
export default GameList;