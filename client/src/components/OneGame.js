import React, { useState, useEffect } from "react";
import axios from "axios";
import { navigate } from "@reach/router";

/////////Material UI Links/////////
import { styled } from "@mui/material/styles";
import { Typography, Paper, Grid } from "@material-ui/core"; //Button link removed
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import AddCommentIcon from "@mui/icons-material/AddComment";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

///////////////////////////////////////////////////////////////////////////
const OneGame = (props) => {
    const { id } = props;
    const [game, setGame] = useState([]);
    const [likeErrs, setLikeErrs] = useState("");
    const [cmtErrs, setCmtErrs] = useState("");
    const [commentText, setCommentText] = useState("");
    const [userId, setUserId] = useState("");
    const [onSubmitDummy, setOnSubmitDummy] = useState(false);

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
    }));

    useEffect(() => {
        async function getData() {
        try {
            const response = await axios.get(
            `http://localhost:8000/api/games/${id}`
            );
            console.log(response);
            const myGame = response.data;
            console.log(myGame);
            setGame(myGame);
        } catch (err) {
            console.log(err.response);
        }
    }
    getData();
    }, [onSubmitDummy, id]);

    useEffect(() => {
        setUserId(localStorage.getItem("userId"));
    }, []);

    const addLikeHandler = () => {
        axios
        .put(
            `http://localhost:8000/api/like/games/${id}`,
            {},
            {
            // this will force the sending of the credentials / cookies so they can be updated
            // XMLHttpRequest from a different domain cannot set cookie values for their own domain
            // unless withCredentials is set to 'true' before making the request
            withCredentials: true,
            }
        )
        .then((likedGame) => {
            console.log(likedGame.data);
            setOnSubmitDummy(!onSubmitDummy);
            navigate(`/games/${likedGame.data._id}`);
            setLikeErrs("");
        })
        .catch((err) => {
            console.log(err.response.data.msg);
            setLikeErrs(err.response.data.msg);
        });
    };

    const removeLikeHandler = () => {
        axios
        .put(
            `http://localhost:8000/api/removelike/games/${id}`,
            {},
            {
            // this will force the sending of the credentials / cookies so they can be updated
            // XMLHttpRequest from a different domain cannot set cookie values for their own domain
            // unless withCredentials is set to 'true' before making the request
            withCredentials: true,
            }
        )
        .then((removeLikeGame) => {
            console.log(removeLikeGame.data);
            setOnSubmitDummy(!onSubmitDummy);
            navigate(`/games/${removeLikeGame.data._id}`);
            setLikeErrs("");
        })
        .catch((err) => {
            console.log(err.response.data.msg);
            setLikeErrs(err.response.data.msg);
        });
    };

    const onSubmitCommentHandler = async (event, gameId) => {
        event.preventDefault();
        const newComment = {
        comment: commentText,
        commentDate: new Date(),
    };
    try {
        const response = await axios.post(
            `http://localhost:8000/api/comments/${gameId}`,
            newComment,
            { withCredentials: true }
        );
        console.log(response);
        setCommentText("");
        setCmtErrs("");
        setOnSubmitDummy(!onSubmitDummy);
    } catch (err) {
        console.log(err.response.data.errors);
        setCmtErrs(err.response.data.errors.comment.message);
    }
    };

///////////////////////////////////////////////////////////////////////////

    return (
    <div>
      {/* {errs ? <></> : null} */}
        <Grid container spacing={2}>
            <Grid item xs={6}>
            <Item>
                <img src={game.pictureUrl} alt={game.gameDescription} />
                {/* <div className='center'> */}
                <Paper>
                <Typography
                    sx={{ fontSize: 14 }}
                    color='text.secondary'
                    gutterBottom
                    >
                        Title: {game.gameTitle}
                </Typography>
                <Typography
                    sx={{ fontSize: 14 }}
                    color='text.secondary'
                    gutterBottom
                >
                    Description: {game.gameDescription}
                </Typography>
                <Typography
                    sx={{ fontSize: 14 }}
                    color='text.secondary'
                    gutterBottom
                >
                    Game Platform: {game.gamePlatform}
                </Typography>
              {/* Need to insert a ternary to not let it blow up if a user_id is not found */}
                {game.user_id ? (
                <>
                    <Typography variant='body2' color='textPrimary'>
                        Posted By: {game.user_id.firstName}
                    </Typography>
                    <Typography variant='body2' color='textPrimary'>
                        Poster email address: {game.user_id.email}
                    </Typography>
                </>
                ) : null}
            </Paper>
            </Item>
        </Grid>
        <Grid item xs={6}>
            <Item>
            <Paper>
                {game.likes ? (
                <>
                    <Typography variant='body1' color='textPrimary'>
                        Likes: {game.likes.length}
                    </Typography>
                </>
                ) : null}
                {userId ? (
                <>
                    {likeErrs ? (
                        <span className='error-text'>{likeErrs}</span>
                    ) : null}
                    <div>
                    {/* <Button
                        variant='outlined'
                        color='primary'
                        onClick={addLikeHandler}
                    >
                        Add Like
                    </Button> */}
                    <Tooltip title='Add Like'>
                        <IconButton>
                        <ThumbUpIcon
                            color='red'
                            fontSize='large'
                            onClick={addLikeHandler}
                        />
                        </IconButton>
                    </Tooltip>
                    {/* <Button
                        variant='outlined'
                        color='secondary'
                        onClick={removeLikeHandler}
                    >
                        Remove Like
                    </Button> */}
                    <Tooltip title='Remove Like'>
                        <IconButton>
                        <NotInterestedIcon
                            color='red'
                            fontSize='large'
                            onClick={removeLikeHandler}
                        />
                        </IconButton>
                    </Tooltip>
                    </div>
                    <form onSubmit={onSubmitCommentHandler}>
                    <hr />
                    {cmtErrs ? (
                        <span className='error-text'>{cmtErrs}</span>
                    ) : null}
                    <Typography variant='h5' color='textPrimary'>
                        ADD COMMENT
                    </Typography>
                    <textarea
                        name=''
                        id=''
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        cols='30'
                        rows='4'
                    ></textarea>
                    <div className='center'>
                        {/* <Button variant='outlined' color='primary' type='submit'>
                        Add Comment
                      </Button> */}
                        <Tooltip title='Add Comment'>
                            <IconButton type='submit'>
                                <AddCommentIcon color='red' fontSize='large' />
                            </IconButton>
                        </Tooltip>
                        </div>
                    </form>
                </>
                ) : null}
                <hr />
                {game.comments ? (
                <>
                    {game.comments.map((comment, index) => (
                    <div className='comment-style' key={"comment_" + index}>
                        <p></p>
                        <Typography variant='body1' color='textPrimary'>
                            {comment.comment}
                        </Typography>
                        <Typography variant='body1' color='textSecondary'>
                            Posted on:
                            {new Date(comment.commentDate).toLocaleDateString(
                            "en-us"
                            )}{" "}
                            By: {comment.user_id.firstName}
                        </Typography>
                        </div>
                    ))}
                </>
                ) : null}
                </Paper>
            </Item>
            </Grid>
        </Grid>
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
      {/* </div> */}
    </div>
    );
};

export default OneGame;