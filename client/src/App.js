import './App.css';
import React from 'react';
import {Router} from '@reach/router'
import Header from './views/Header'
import NewGame from './components/NewGame'
import AllGames from './components/AllGames'
import OneGame from './components/OneGame'
import EditGame from './components/EditGame'
import LogReg from './views/LogReg'
import UserProfile from './components/UserProfile'

/////////Material UI Links/////////
import {ThemeProvider, createTheme} from "@mui/material/styles";

///////////////////////////////////////////////////////////////////////////
const theme = createTheme({
  palette: {
    background: {
      default: "#263238", //
    },
    primary: {
      main: "#673ab7", // This is an purple looking color
    },
    secondary: {
      main: "#ff1744", //Another red-ish color
    },
    text: {
      primary: "#212121",
      secondary: "#212121",
    },
  },
});
//////////////////////////////////////////////////////////////////////////



function App() {

  const NotFound = () => {
    return <div>Route not Found</div>;
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header />
        <hr />
        <Router>
          <LogReg path="/" />
          <NotFound default />
          <AllGames path="/games" />
          <NewGame path="/games/new" />  
          <OneGame path="/games/:id" />
          <EditGame path="/game/edit/:id" />
          <UserProfile path="/user/games/:id" />
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
