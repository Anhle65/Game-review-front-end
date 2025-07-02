import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
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
            <Route path="game-review/games" element={<GameList params={{}}/>} />
            <Route path="game-review/games/create" element={<NewGame />} />
            <Route path="game-review/games/:id/edit" element={<NewGame />} />
            <Route path="game-review/games/:id" element={<Game />} />
            <Route path="game-review/games/user/:id" element={<GameList params={{}}/>} />
            <Route path="game-review/users/:id/profile" element={<UserProfile />} />
            <Route path="game-review/users/:id/edit" element={<EditUserProfile />} />
            <Route path="game-review/users/:id/myGames" element={<UserGames />} />
            <Route path="game-review/users/:id/reviewed" element={<UserGameReview />} />
            <Route path="game-review/users/:id/owned" element={<UserGameOwned />} />
            <Route path="game-review/users/:id/wishlisted" element={<UserGameWishlist />} />
            <Route path="game-review/users/login" element={<Login />} />
            <Route path="game-review/users/register" element={<UserRegister />} />
            <Route path="game-review/*" element={<GameList params={{}} />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;