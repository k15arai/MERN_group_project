require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(cookieParser());

require("./config/mongoose.config");

//require routes
require("./routes/user.routes")(app);
require("./routes/game.routes")(app);
require("./routes/comment.routes")(app);

app.listen(process.env.DB_PORT, () =>
  console.log(`You are connected to port ${process.env.DB_PORT}`)
);
