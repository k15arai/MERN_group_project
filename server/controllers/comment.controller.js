const Comment = require("../models/comment.model");
const Game = require("../models/game.model");

const jwt = require("jsonwebtoken");

module.exports = {
  //Get all comments
  getAllComments: (req, res) => {
    Comment.find({})
      .sort({ commentDate: "descending" })
      .populate("user_id", "firstName lastName")
      .then((allComments) => {
        console.log(allComments);
        res.json(allComments);
      })
      .catch((err) => {
        console.log("Get all comments failed");
        res.json({ message: "Something went wrong with GetAll, ", error: err });
      });
  },

  //Create a new comment
  createNewComment: async (req, res) => {
    const { body, params } = req;
    let newCommentObject = new Comment(body);
    let gameQuery;
    newCommentObject.game = params.gameId;
    const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true });
    newCommentObject.user_id = decodedJwt.payload._id;
    // newCommentObject.user_id = req.jwtpayload.id;

    try {
      newCommentObject = await newCommentObject.save();
      gameQuery = await Game.findByIdAndUpdate(
        { _id: params.gameId },
        {
          $push: { comments: { $each: [newCommentObject._id], $position: 0 } },
        },
        { new: true, useFindAndModify: true }
      );
      res.json({ newCommentObject, gameQuery });
    } catch (err) {
      console.log("Something went wrong in createNewComment");
      res.status(400).json(err);
    }
  },

  //Delete a comment
  deleteOneComment: (req, res) => {
    Comment.deleteOne({ _id: req.params.id })
      .then((deletedComment) => {
        console.log(deletedComment);
        res.json(deletedComment);
      })
      .catch((err) => {
        console.log("Delete one comment failed");
        res.json({
          message: "Something went wrong in deleteComment ",
          error: err,
        });
      });
  },
};
