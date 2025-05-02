import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import NotFound from "./components/NotFound";
import Games from "./components/Games";
import GameList from "./components/GameList";
import {rootUrl} from "./base.routes";
import GameListObject from "./components/GameListObject";
import Game from "./components/Game";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import NewGame from "./components/NewGame";
import UserRegister from "./components/UserRegister";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path={rootUrl + "/"} element={<Game />} />
            <Route path={rootUrl + "/games"} element={<GameList />} />
            <Route path={rootUrl + "/games/create"} element={<NewGame />} />
            <Route path={rootUrl + "/games/:id"} element={<Game />} />
            <Route path={rootUrl + "/users/:id"} element={<UserProfile />} />
            <Route path={rootUrl + "/users/login"} element={<Login />} />
            <Route path={rootUrl + "/users/register"} element={<UserRegister />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      {/*<header className="App-header">*/}
      {/*  <img src={logo} className="App-logo" alt="logo" />*/}
      {/*  <p>*/}
      {/*    Edit <code>src/App.tsx</code> and save to reload.*/}
      {/*  </p>*/}
      {/*  <a*/}
      {/*    className="App-link"*/}
      {/*    href="https://reactjs.org"*/}
      {/*    target="_blank"*/}
      {/*    rel="noopener noreferrer"*/}
      {/*  >*/}
      {/*    Learn React*/}
      {/*  </a>*/}
      {/*</header>*/}
      </Router>
    </div>
  );
}

export default App;
