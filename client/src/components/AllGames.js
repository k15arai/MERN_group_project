import React, { useState, useEffect } from "react";
import axios from "axios";
import { navigate } from "@reach/router";

/////////Material UI Links/////////
import { Typography, Grid } from "@material-ui/core";
import GameCard from "./GameCard";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

///////////////////////////////////////////////////////////////////////////
const AllGames = (props) => {
  // Array of objects for get all
    const [displayGames, setDisplayGames] = useState([]);
    const [allGames, setAllGames] = useState([]);
    const [platformFilter, setPlatformFilter] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
    axios
        .get("http://localhost:8000/api/games")
        .then((allReturnedGames) => {
        console.log(allReturnedGames.data);
        setDisplayGames(allReturnedGames.data);
        setAllGames(allReturnedGames.data);
        })
        .catch((err) => {
        console.log(err);
        });
    }, []);

    useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    }, []);

  // Filter games on All Games page
    const filterGameListHandler = (event, platformFilter) => {
    event.preventDefault();
    console.log(platformFilter);
    if (platformFilter === "All") {
        setDisplayGames(allGames);
    } else {
      // filter out to remove from the DOM
        const filteredGamesArray = allGames.filter(
        (game) => game.gamePlatform === platformFilter
        );
        setDisplayGames(filteredGamesArray);
    }
    };

    const deleteGameHandler = (gameId) => {
    axios
        .delete("http://localhost:8000/api/games/" + gameId, {
        // this will force the sending of the credentials / cookies so they can be updated
        // XMLHttpRequest from a different domain cannot set cookie values for their own domain
        // unless withCredentials is set to 'true' before making the request
        withCredentials: true,
        })
        .then((res) => {
        const deletedGame = res.data;
        console.log(deletedGame);
        // filter out to remove from the DOM
        const filteredGamesArray = displayGames.filter(
            (game) => game._id !== gameId
        );
        setDisplayGames(filteredGamesArray);
        setAllGames(filteredGamesArray);
        })
        .catch((err) => {
        console.log(err);
        });
    };
///////////////////////////////////////////////////////////////////////////


    return (
    <div>
        <Typography variant='h5' color='textPrimary'>
        All Games
        </Typography>
        <div className='center'>
        {userId ? (
          // <Button
          //   variant='outlined'
          //   color='primary'
          //   onClick={() => navigate("/games/new")}
          // >
          //   Create New Game
          // </Button>
            <Tooltip title='Filter List'>
            <IconButton type='submit'>
                <AddBoxIcon
                fontSize='large'
                color='primary'
                onClick={() => navigate("/games/new")}
                />
            </IconButton>
            </Tooltip>
        ) : null}
        </div>
        <div key='platformFilter-area' id='platformFilter-area'>
        <form onSubmit={(e) => filterGameListHandler(e, platformFilter)}>
            <label>
            <strong>Platform:</strong> Where do you play?
            </label>
            <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            >
            <option value='All' default>
                ALL
            </option>
            <option value='PC'>PC</option>
            <option value='Xbox'>Xbox</option>
            <option value='PlayStation'>PlayStation</option>
            <option value='Nintendo'>Nintendo</option>
            <option value='Steam'>Steam</option>
            <option value='Other'>Other</option>
            </select>
            {/* <Button type='submit' variant='outlined'>
            Filter
          </Button> */}
            <Tooltip title='Filter List'>
            <IconButton type='submit'>
                <FilterAltIcon fontSize='large' color='primary' />
            </IconButton>
            </Tooltip>
        </form>
        </div>
        {displayGames.map((game, index) => (
        <div key={index}>
            <hr />
            <Grid container>
            <Grid item xs={5}>
                <img src={game.pictureUrl} alt={game.description} />
            </Grid>
            <Grid item xs={7}>
                <GameCard game={game} userId={userId} />
                {userId && game.user_id._id.toString() === userId.toString() ? (
                <Tooltip title='Edit Game'>
                    <IconButton>
                    <EditIcon
                        color='primary'
                        onClick={() => navigate(`/games/${game._id}/edit`)}
                    />
                    </IconButton>
                </Tooltip>
              ) : // <Button
              //   size='small'
              //   variant='outlined'
              //   color='inherit'
              //   onClick={() => navigate(`/games/${game._id}/edit`)}
              // >
              //   Edit Game
              // </Button>
                null}
                {userId && game.user_id._id.toString() === userId.toString() ? (
                <Tooltip title='Delete Game'>
                    <IconButton>
                    <DeleteIcon
                        color='secondary'
                        onClick={() => deleteGameHandler(game._id)}
                    />
                    </IconButton>
                </Tooltip>
              ) : // <Button
              //   size='small'
              //   variant='outlined'
              //   color='inherit'
              //   onClick={() => deleteGameHandler(game._id)}
              // >
              //   Delete Game
              // </Button>
                null}
            </Grid>
            </Grid>
        </div>
        ))}
    </div>
    );
};

export default AllGames;