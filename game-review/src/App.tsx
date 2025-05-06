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
import EditUserProfile from "./components/EditUserProfile";
function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<GameList />} />
            <Route path="/games" element={<GameList />} />
            <Route path="/games/create" element={<NewGame />} />
            <Route path="/games/:id" element={<Game />} />
            <Route path="/games/user/:id" element={<GameList />} />
            <Route path="/users/:id/profile" element={<UserProfile />} />
            <Route path="/users/:id/edit" element={<EditUserProfile />} />
            <Route path="/users/login" element={<Login />} />
            <Route path="/users/register" element={<UserRegister />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
