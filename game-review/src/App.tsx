import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import NotFound from "./components/NotFound";
import Game from "./components/game/Game";
import Login from "./components/user/Login";
import NewGame from "./components/game/NewGame";
import UserRegister from "./components/user/UserRegister";
import UserProfile from "./components/user/UserProfile";

import GameList from "./components/game/GameList";
import EditUserProfile from "./components/user/EditUserProfile";
import UserGames from "./components/user/UserGames";
import UserGameReview from "./components/user/UserGameReview";
import UserGameWishlist from "./components/user/UserGameWishlist";
import UserGameOwned from "./components/user/UserGameOwned";
function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<GameList params={{}}/>} />
            <Route path="/games" element={<GameList params={{}}/>} />
            <Route path="/games/create" element={<NewGame />} />
            <Route path="/games/:id/edit" element={<NewGame />} />
            <Route path="/games/:id" element={<Game />} />
            <Route path="/games/user/:id" element={<GameList params={{}}/>} />
            <Route path="/users/:id/profile" element={<UserProfile />} />
            <Route path="/users/:id/edit" element={<EditUserProfile />} />
            <Route path="/users/:id/edit" element={<EditUserProfile />} />
            <Route path="/users/:id/myGames" element={<UserGames />} />
            <Route path="/users/:id/reviewed" element={<UserGameReview />} />
            <Route path="/users/:id/owned" element={<UserGameOwned />} />
            <Route path="/users/:id/wishlisted" element={<UserGameWishlist />} />
            <Route path="/users/login" element={<Login />} />
            <Route path="/users/register" element={<UserRegister />} />
            <Route path="*" element={<GameList params={{}} />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;