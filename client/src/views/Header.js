import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import axios from "axios";

/////////Material UI Links/////////
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

///////////////////////////////////////////////////////////////////////////
const Header = () => {
    const [userId, setUserId] = useState("");
    const [fakeBoolean, setFakeBoolean] = useState(false);

    useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    }, [userId]);

    const logout = (e) => {
    e.preventDefault();

    axios
        .post(
        "http://localhost:8000/api/user/logout",
        {
          // no body required for this request
          // would pick up req.body without this empty
        },
        {
            withCredentials: true,
        }
        )
        .then((res) => {
        console.log(res.data);
        localStorage.removeItem("userId");
        setUserId("");
        setFakeBoolean(!fakeBoolean);
        navigate("/");
        })
        .catch((err) => {
        console.log(err);
        navigate("/");
        });
    };
///////////////////////////////////////////////////////////////////////////

    return (
    <div>
        <Box sx={{ flexGrow: 1 }}>
        <AppBar
            position='static'
            style={{ backgroundColor: "black", color: "white" }}
        >
            <Toolbar>
            <IconButton
                size='large'
                edge='start'
                color='inherit'
                aria-label='menu'
                sx={{ mr: 2 }}
            >
                <VideogameAssetIcon fontSize='large' />
            </IconButton>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                GOOD GAME
            </Typography>
            <Tooltip title='Login'>
                <IconButton>
                <LoginIcon
                    color='inherit'
                    fontSize='large'
                    onClick={() => navigate("/")}
                />
                </IconButton>
            </Tooltip>
            <Button
                color='inherit'
                size='small'
                variant='outlined'
                onClick={() => navigate("/home")}
            >
                See All Games
            </Button>
            {/* <Button
                size='small'
                variant='outlined'
                color='inherit'
                onClick={() => navigate("/")}
            >
                Login and Register
            </Button> */}
            {/* <Button
                size='small'
                variant='outlined'
                color='inherit'
                onClick={logout}
            >
                Logout
            </Button> */}
            <Tooltip title='Logout'>
                <IconButton>
                <LogoutIcon color='inherit' fontSize='large' onClick={logout} />
                </IconButton>
            </Tooltip>
            </Toolbar>
        </AppBar>
        </Box>
    </div>
    );
};

export default Header;