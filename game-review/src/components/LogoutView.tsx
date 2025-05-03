import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import {Stack} from "@mui/material";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import React from "react";
import GameList from "./GameList";
import {rootUrl} from "../base.routes";
import {useNavigate} from "react-router-dom";
import LogoutNavBar from "./LogoutNavBar";

const LogoutView = () => {
    return(
        <>
            <LogoutNavBar/>
            <GameList/>
        </>
    )
}
export default LogoutView;