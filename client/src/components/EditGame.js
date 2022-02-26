import React, { useState, useEffect } from "react";
import axios from "axios";
import { navigate } from "@reach/router";

/////////Material UI Links/////////
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

///////////////////////////////////////////////////////////////////////////
const EditGame = (props) => {
    const { gameId } = props;

    const [gameTitle, setGameTitle] = useState("");
    const [gameDescription, setGameDescription] = useState("");
    const [gamePlatform, setGamePlatform] = useState("");
    const [pictureUrl, setPictureUrl] = useState("");
    const [userId, setUserId] = useState("");
  // expects an object
    const [errs, setErrs] = useState({});

    useEffect(() => {
        axios
        .get(`http://localhost:8000/api/games/${gameId}`)
        .then((myGame) => {
        console.log(myGame.data);
        setGameTitle(myGame.data.gameTitle);
        setGameDescription(myGame.data.gameDescription);
        setGamePlatform(myGame.data.gamePlatform);
        setPictureUrl(myGame.data.pictureUrl);
        })
        .catch((err) => {});
    }, [gameId]);

    useEffect(() => {
        setUserId(localStorage.getItem("userId"));
        console.log(userId);
    }, [userId]);

    const submitHandler = (event) => {
        event.preventDefault();
        // do something with axios (post)
        axios
            .put(
            `http://localhost:8000/api/games/${gameId}`,
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
        .then((updatedGame) => {
        if (updatedGame.data.errors) {
            console.log(updatedGame.data.errors);
            setErrs(updatedGame.data.errors);
        } else {
            console.log(updatedGame.data);
            navigate(`/games/${updatedGame.data._id}`);
        }
        })
        .catch((err) => {
        console.log(err);
        });
    };

    return (
    <div>
        <h2>Edit Game</h2>
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
            <label>Which platform are you playing on?</label>
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
        <Tooltip title='Update Game'>
            <IconButton>
            <SaveIcon
                color='primary'
                fontSize='large'
                onClick={submitHandler}
            />
            </IconButton>
        </Tooltip>

        {/* <Button variant='outlined' color='primary' onClick={submitHandler}>
            Edit My Game
        </Button> */}
        </form>
        {/* <Button
        color='inherit'
        variant='outlined'
        onClick={() => navigate("/games")}
        >
        See All Games
      </Button> */}
    </div>
    );
};

export default EditGame;