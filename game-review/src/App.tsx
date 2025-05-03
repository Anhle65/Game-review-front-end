import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import NotFound from "./components/NotFound";
import {rootUrl} from "./base.routes";
import Game from "./components/Game";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import NewGame from "./components/NewGame";
import UserRegister from "./components/UserRegister";
import LogoutUser from "./components/LogoutUser";
function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path={rootUrl + "/"} element={<Game />} />
            <Route path={rootUrl + "/games"} element={<LogoutUser />} />
            <Route path={rootUrl + "/games/create"} element={<NewGame />} />
            <Route path={rootUrl + "/games/:id"} element={<Game />} />
            <Route path={rootUrl + "/users/:id"} element={<UserProfile />} />
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
