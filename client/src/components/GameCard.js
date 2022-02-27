import * as React from "react";
import { navigate } from "@reach/router";

/////////Material UI Links/////////
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

///////////////////////////////////////////////////////////////////////////
const GameCard = (props) => {
    const { game } = props;

///////////////////////////////////////////////////////////////////////////

    return (
    <Card sx={{ minWidth: 275 }}>
        <CardContent>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
            <strong>Title:</strong> {game.gameTitle}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
            <strong>Description:</strong> {game.gameDescription}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
            <strong>Platform:</strong> {game.gamePlatform}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
            <strong>Likes:</strong> {game.likes.length}
        </Typography>
        </CardContent>
        <CardActions>
        <Tooltip title='Game Details'>
            <IconButton>
                <ReadMoreIcon
                fontSize='large'
                color='primary'
                onClick={() => navigate(`/games/${game._id}`)}
                />
            </IconButton>
        </Tooltip>
        {game.user_id ? (
            <Tooltip title={`Added by: ${game.user_id.firstName}`}>
                <IconButton>
                <PersonIcon
                fontSize='large'
                color='primary'
                onClick={() => navigate(`/user/games/${game.user_id._id}`)}
                />
            </IconButton>
            </Tooltip>
        ) : null}
        </CardActions>
    </Card>
    );
};

export default GameCard;