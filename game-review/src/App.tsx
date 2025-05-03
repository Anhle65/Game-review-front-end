import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import NotFound from "./components/NotFound";
import {rootUrl} from "./base.routes";
import Game from "./components/Game";
import Login from "./components/Login";
import LoginView from "./components/LoginView";
import NewGame from "./components/NewGame";
import UserRegister from "./components/UserRegister";
import LogoutView from "./components/LogoutView";
import UserProfile from "./components/UserProfile";
import LoginViewGame from "./components/LoginViewGame";
import LogoutViewGame from "./components/LogoutViewGame";
function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path={rootUrl + "/"} element={<Game />} />
            <Route path={rootUrl + "/games"} element={<LogoutView />} />
            <Route path={rootUrl + "/games/create"} element={<NewGame />} />
            <Route path={rootUrl + "/games/:id/user"} element={<LoginViewGame />} />
            <Route path={rootUrl + "/games/:id"} element={<LogoutViewGame />} />
            <Route path={rootUrl + "/games/users/:id"} element={<LoginView />} />
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
