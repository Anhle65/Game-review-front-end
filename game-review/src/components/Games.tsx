import axios from 'axios';
import React from "react";
import {Link, useNavigate} from "react-router-dom";
import CSS from 'csstype';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { rootUrl } from '../base.routes';
import {
    Alert,
    AlertTitle,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Paper, Snackbar,
    Stack,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
const card: CSS.Properties = {
    padding: "10px",
    margin: "20px",
}
interface HeadCell {
    id: string;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    { id: 'ID', label: 'id', numeric: true },
    { id: 'username', label: 'Username', numeric: false },
    { id: 'link', label: 'Link', numeric: false },
    { id: 'actions', label: 'Actions', numeric: false }
];
const Games = () => {
    const [games, setGames] = React.useState <Array<Game>> ([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const navigate = useNavigate();
    React.useEffect(() => {
        getGames()
    }, [])
    const getGames = () => {
        axios.get('http://localhost:4941'+ rootUrl + '/games')
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setGames(response.data['games'])
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const game_rows = () => {
        return games.map((row: Game) =>
            <TableRow hover tabIndex={-1} key={row.gameId}>
                <TableCell align="center">
                    {row.gameId}
                </TableCell>
                <TableCell align="center">{row.title}</TableCell>
                <TableCell align="center"><Link to={"/games/"+row.gameId}>
                    Go to game</Link></TableCell>
            </TableRow>)
    }
    if (errorFlag) {
        return (
            <div>
                {errorFlag &&
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>}
            </div>
        )
    } else {
        return (
            <div>
                <Paper elevation={3} style={card}>
                    <h1>Games</h1>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headCells.map((headCell) => (
                                        <TableCell
                                            key={headCell.id}
                                            align="center"
                                            padding={'normal'}>
                                            {headCell.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            {game_rows()}
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
        )
    }
}
export default Games;