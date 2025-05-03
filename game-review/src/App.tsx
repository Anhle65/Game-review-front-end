import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import NotFound from "./components/NotFound";
import {rootUrl} from "./base.routes";
import Game from "./components/Game";
import Login from "./components/Login";
import NewGame from "./components/NewGame";
import UserRegister from "./components/UserRegister";
import UserProfile from "./components/UserProfile";

import GameList from "./components/GameList";
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
            <Route path={rootUrl + "/games/user/:id"} element={<GameList />} />
            <Route path={rootUrl + "/users/:id/profile"} element={<UserProfile />} />
            <Route path={rootUrl + "/users/login"} element={<Login />} />
            <Route path={rootUrl + "/users/register"} element={<UserRegister />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
