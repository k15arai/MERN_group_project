const Game = require("../models/game.model");
const jwt = require("jsonwebtoken");

module.exports = {
  //Find all games
  getAllGames: (req, res) => {
    Game.find({})
      .populate("user_id", "firstName _id")
      .sort({ likesLength: "descending" })
      .then((allGames) => {
        console.log("In get all games section");
        res.json(allGames);
      })
      .catch((err) => {
        console.log("Get all games failed");
        res.json({ message: "Something went wrong with GetAll, ", error: err });
      });
  },

  // Get all games by user
  getAllGamesByUser: (req, res) => {
    Game.find({ user_id: req.params.userId })
      .populate("user_id", "firstName _id email")
      .populate({
        path: "comments",
        options: { limit: 2, sort: { createdAt: -1 } },
        populate: { path: "user_id" },
      })
      .sort({ likesLength: "descending" })
      .then((allUserGames) => {
        console.log("success - returning all user games");
        res.json(allUserGames);
      })
      .catch((err) => {
        console.log(err);
        res
          .status(400)
          .json("something went wrong in getting games for user:" + err);
      });
  },

  //Create a new game
  createNewGame: (req, res) => {
    const newGameObject = new Game(req.body);

    //gives access to the user information stored in the cookie
    const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true });
    newGameObject.user_id = decodedJwt.payload._id;
    // this code might not be working
    // newGameObject.user_id = req.jwtpayload.id;

    newGameObject
      .save(req.body)
      .then((newGame) => {
        console.log(newGame);
        res.json(newGame);
      })
      .catch((err) => {
        console.log("Something went wrong in createNewGame");
        res.status(400).json(err);
      });
  },

  //Get one game
  findOneGame: (req, res) => {
    Game.findOne({ _id: req.params.id })
      .populate("user_id", "_id firstName email")
      .populate({
        path: "comments",
        options: { limit: 5, sort: { createdAt: -1 } },
        populate: { path: "user_id" },
      })
      .then((oneGame) => {
        console.log("Success - in find one game section");
        res.status(200).json(oneGame);
      })
      .catch((err) => {
        console.log("Find one game failed!");
        res.status(400).json({
          message: "Something went wrong in findOneGame ",
          error: err,
        });
      });
  },

  //Delete a game
  deleteGame: (req, res) => {
    Game.deleteOne({ _id: req.params.id })
      .then((deletedGame) => {
        console.log("In delete game section");
        res.status(200).json(deletedGame);
      })
      .catch((err) => {
        console.log("Delete one game failed");
        res.status(400).json({
          message: "Something went wrong in deleteGame ",
          error: err,
        });
      });
  },

  //Updating a game
  updateGame: (req, res) => {
    Game.findByIdAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((updatedGame) => {
        console.log("In updated games section - success");
        res.status(200).json(updatedGame);
      })
      .catch((err) => {
        console.log("Something went wrong in updateGame");
        res.status(400).json(err);
      });
  },

  // Add Like to Game
  likeGame: async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);

      const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true });

      if (
        game.likes.filter(
          (like) => like._id.toString() == decodedJwt.payload._id
        ).length > 0
      ) {
        return res
          .status(400)
          .json({ msg: "Game has already been liked by user" });
      }
      console.log(req.params.id);
      Game.findByIdAndUpdate(
        req.params.id,
        {
          $push: { likes: decodedJwt.payload._id },
          $inc: { likesLength: 1 },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      )
        .populate("likes")
        .then((updatedGame) => {
          console.log(updatedGame);
          res.json(updatedGame);
        });
    } catch (err) {
      console.log("error in update likes game: " + err);
      res.json(err);
    }
  },

  // Remove Like from Game
  removeGameLike: async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);

      const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true });

      if (
        game.likes.filter(
          (like) => like._id.toString() == decodedJwt.payload._id
        ).length === 0
      ) {
        console.log("in section where no like was found");
        return res
          .status(400)
          .json({ msg: "Game has not yet been liked by user" });
      }

      Game.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likes: decodedJwt.payload._id },
          $inc: { likesLength: -1 },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      )
        .populate("likes", "_id")
        .then((updatedGame) => {
          console.log(updatedGame);
          res.json(updatedGame);
        });
    } catch (err) {
      console.log("error in update likes game: " + err);
      res.json({ msg: "Error in the catch" });
    }
  },
};
