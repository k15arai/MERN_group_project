import React, { useState, useEffect } from "react";
import axios from "axios";
import { navigate } from "@reach/router";

/////////Material UI Links/////////
import { Paper, Typography } from "@material-ui/core";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";


///////////////////////////////////////////////////////////////////////////
const UserProfile = (props) => {
    const [userGamesList, setUserGamesList] = useState([]);
    const { id } = props;

    useEffect(() => {
        axios
        .get(`http://localhost:8000/api/user/games/${id}`)
        .then((res) => {
            console.log(res.data);
            setUserGamesList(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }, [id]);


///////////////////////////////////////////////////////////////////////////

    return (
    <div style={{ textAlign: "center" }}>
        {userGamesList.map((game, index) => (
            <div key={"user-games" + index}>
            <img src={game.pictureUrl} alt={game.description} />
            <div className='center'>
            <Paper>
                <Typography variant='h6' color='inherit'>
                    Game Title: {game.gameTitle}
                </Typography>
                <Typography variant='body1' color='textPrimary'>
                    Game Description: {game.gameDescription}
                </Typography>
                <Typography variant='body1' color='textPrimary'>
                    Game Platform:{game.gamePlatform}
                </Typography>
                {game.user_id ? (
                <>
                    <Typography variant='body1' color='textPrimary'>
                        Posted By: {game.user_id.firstName}
                    </Typography>
                    <Typography variant='body1' color='textPrimary'>
                        Poster email address: {game.user_id.email}
                    </Typography>
                </>
                ) : null}
                {game.likes ? (
                    <Typography variant='body1' color='textPrimary'>
                    Likes: {game.likes.length}
                    </Typography>
                ) : null}
            </Paper>
            <hr />
            {game.comments ? (
                <>
                {game.comments.map((comment, index) => (
                    <div className='comment-style' key={"comment_" + index}>
                    <p>{comment.comment}</p>
                    Posted on:
                    {new Date(comment.commentDate).toLocaleDateString(
                        "en-us"
                    )}{" "}
                    By: {comment.user_id.firstName}
                    </div>
                ))}
                </>
            ) : null}
            </div>
        </div>
        ))}
        <div>
        <Tooltip title='See All Games'>
            <IconButton>
            <ArrowBackIcon
                color='primary'
                fontSize='large'
                onClick={() => navigate("/games")}
            />
            </IconButton>
        </Tooltip>
        </div>
    </div>
    );
};

export default UserProfile;