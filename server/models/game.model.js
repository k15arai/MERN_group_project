const mongoose = require("mongoose");

// Games
const GameSchema = new mongoose.Schema(
  {
    gameTitle: {
      type: String,
      required: [true, "You need to input a game title"],
      minlength: [1, "Your game title should be at least 1 characters long"],
    },
    gameDescription: {
      type: String,
      required: [true, "You need to add the game description"],
      minlength: [
        5,
        "Your game description should be at least 5 characters long",
      ],
      maxlength: [
        250,
        "Your game description should not be longer than 250 characters",
      ],
    },
    gamePlatform: {
      // dropdown list where we can have a default value
      type: String,
      required: [true, "You must enter a gaming platform"],
      enum: ["PC", "Xbox", "PlayStation", "Nintendo", "Steam", "Other"],
    },
    // completely optional
    pictureUrl: {
      type: String,
    },
    // add the user.id for the user that created this object
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      // comes from user model
      ref: "User",
    },
    // array of comment objects
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likesLength: {
      type: Number,
    },
  },
  { timestamps: true }
);

GameSchema.pre("deleteOne", function (next) {
  const gameId = this.getQuery()["_id"];
  mongoose
    .model("Comment")
    .deleteMany({ game: gameId }, function (err, result) {
      if (err) {
        console.log(`[error] ${err}`);
        next(err);
      } else {
        console.log("success - deleting comments");
        next();
      }
    });
});

// collection names are all lowercase and plural - based on the string 'Game'
module.exports = mongoose.model("Game", GameSchema);
