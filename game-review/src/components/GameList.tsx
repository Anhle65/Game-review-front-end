import React, {ChangeEvent} from "react";
import axios from "axios";
import CSS from 'csstype';
import {Alert, AlertTitle, Autocomplete, Fab, Pagination, PaginationItem, Paper, Stack, TextField} from "@mui/material";
import { rootUrl } from "../base.routes";
import GameListObject from "./GameListObject";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from "@mui/icons-material/Search";
import LogInNavBar from "./LogInNavBar";
import LogoutNavBar from "./LogoutNavBar";
import {useUserStore} from "../store";
type GameListProps = {
    params: Record<string, string | number | boolean | any[]>;
};
const GameList = ({params}: GameListProps) => {
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
        {label:'RATING_ASC', value: 'Best rating'}, {label:'RATING_DESC', value: 'Low rating'}];
    const [value, setValue] = React.useState('Oldest games');
    const [inputValue, setInputValue] = React.useState('');
    const [labelSorting, setLabelSorting] = React.useState('CREATED_ASC');
    React.useEffect(() => {
        let filterParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => filterParams.append(key, String(v)));
            } else {
                filterParams.append(key, String(value));
            }
        });
        let url = `http://localhost:4941${rootUrl}/games`;
        if(characterSearching.trim()) {
            filterParams.append('q', characterSearching);
        }
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
        }, [characterSearching, labelSorting]
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
    const game_rows = () => games.slice((currentPage - 1) * 9, currentPage * 9).map((game: Game) => <GameListObject key={game.gameId + game.title} game={game}/>);
    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "block",
        width: "fit-content",
        minWidth: "1000px"
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
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Stack direction="row" spacing={2}>
            <Paper elevation={3} style={card} sx={{justifyContent: 'flex-start',
                alignItems: 'flex-start'}}>
                <Stack direction="row" spacing={2} sx={{justifyContent: 'space-between'}} padding='15px 20px 0 15px'>
                    <div>
                        <Stack direction='row'>
                            <SearchIcon fontSize='large'/>
                            <input type='text' style={{width: "300px", overflowY: "auto"}} placeholder="Search..."
                                   className="form-control" id="input" value={characterSearching} onChange={handleInputSearchingChange}/>
                        </Stack>
                    </div>
                    <Autocomplete
                        value={value}
                        onChange={(event: any, newValue: string| null) => handleSorting(event, newValue)}
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        id="sort-by-selection"
                        options={optionSortBy.map(o => o.value)}
                        sx={{width: 200}}
                        renderInput={(params) => <TextField {...params} label="Sort by"/>}
                    />
                </Stack>
                <div style={{display: "inline-block", maxWidth: "965px", minWidth: "320px"}}>
                    {errorFlag ? (
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>
                    ) : null}
                    {game_rows()}
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Pagination
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
            </Paper>
            </Stack>
        </div>
        </>
)

}
export default GameList;