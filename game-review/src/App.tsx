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

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path={rootUrl + "/"} element={<Game />} />
            <Route path={rootUrl + "/games"} element={<GameList />} />
            <Route path={rootUrl + "/games/:id"} element={<Game />} />
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
