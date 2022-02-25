const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Comment is required"],
      minlength: [3, "Your comment must be at least 3 characters long"],
    },
    commentDate: {
      type: Date,
      required: [true, "Comment Date is required"],
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: "A game is required to create a comment",
    },
    // who posted it / created it
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// this will create a new collection in our DB called "comments"
// it will lower case our string and make it plural "automatically" for us
const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
