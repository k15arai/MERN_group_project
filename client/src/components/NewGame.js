import React, { useState } from "react";
import axios from "axios";
import { navigate } from "@reach/router";

/////////Material UI Links/////////
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

///////////////////////////////////////////////////////////////////////////
const NewGame = () => {
    const [gameTitle, setGameTitle] = useState("");
    const [gameDescription, setGameDescription] = useState("");
    const [gamePlatform, setGamePlatform] = useState("PC");
    const [pictureUrl, setPictureUrl] = useState("");
  // const [userId, setUserId] = useState("");
  // expects an object
    const [errs, setErrs] = useState({});

    const submitHandler = (event) => {
    event.preventDefault();
    // do something with axios (post)
    axios
        .post(
        "http://localhost:8000/api/games",
        {
            gameTitle: gameTitle,
            gameDescription: gameDescription,
            gamePlatform: gamePlatform,
            pictureUrl: pictureUrl,
            },
            {
            // this will force the sending of the credentials / cookies so they can be updated
            // XMLHttpRequest from a different domain cannot set cookie values for their own domain
          // unless withCredentials is set to 'true' before making the request
            withCredentials: true,
        }
        )
        .then((response) => {
        console.log(response.data);
        navigate(`/games/${response.data._id}`);
        })
        .catch((err) => {
        console.log(err.response.data.errors);
        setErrs(err.response.data.errors);
        });
    };

///////////////////////////////////////////////////////////////////////////

    return (
    <div>
        <h2>New Game</h2>
        <form onSubmit={submitHandler}>
        <div>
            <label>Game Title</label>
            {errs.gameTitle ? (
            <span className='error-text'>{errs.gameTitle.message}</span>
            ) : null}
            <input
            type='text'
            name='gameTitle'
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
            />
        </div>
        <div>
            <label>Game Description</label>
            {errs.gameDescription ? (
            <span className='error-text'>{errs.gameDescription.message}</span>
            ) : null}
            <input
            type='text'
            name='gameDescription'
            value={gameDescription}
            onChange={(e) => setGameDescription(e.target.value)}
            />
        </div>
        <div>
            <label>Which Platform Are You Playing On?</label>
            {errs.gamePlatform ? (
            <span className='error-text'>{errs.gamePlatform.message}</span>
            ) : null}
            <select
            name='gamePlatform'
            value={gamePlatform}
            onChange={(e) => setGamePlatform(e.target.value)}
            >
            <option value='PC'>PC</option>
            <option value='Xbox'>Xbox</option>
            <option value='PlayStation'>PlayStation</option>
            <option value='Nintendo'>Nintendo</option>
            <option value='Steam'>Steam</option>
            <option value='Other'>Other</option>
            </select>
        </div>
        <div>
            <label>Game Image (keep it safe!)</label>
            <input
            type='text'
            name='pictureUrl'
            value={pictureUrl}
            onChange={(e) => setPictureUrl(e.target.value)}
            />
        </div>
        <Tooltip title='See All Games'>
            <IconButton>
            <ArrowBackIcon
                color='primary'
                fontSize='large'
                onClick={() => navigate("/games")}
            />
            </IconButton>
        </Tooltip>
        <Tooltip title='Add My Game'>
            <IconButton type='submit'>
            <SaveIcon
                color='primary'
                fontSize='large'
                onClick={submitHandler}
            />
            </IconButton>
        </Tooltip>
        {/* <Button variant='contained' color='primary' type='submit'>
            Add My Game
        </Button> */}
        {/* <Button
            variant='outlined'
            color='primary'
            onClick={() => navigate("/games")}
        >
            Back to All Games
        </Button> */}
        </form>
    </div>
    );
};

export default NewGame;