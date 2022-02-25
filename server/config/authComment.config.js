const jwt = require("jsonwebtoken");
const Comment = require("../models/comment.model");

// this file is used as Middleware to check if a user can modify data
// before we pass the request on to the controller, we will authorize
// the request

const authorizeComment = async (req, res, next) => {
  const { params } = req;
  console.log(req.cookies.usertoken);
  const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true });
  console.log(decodedJwt.payload._id);
  console.log("check 1");
  const commentToCheck = await Comment.findById(params.id);
  // console.log(commentToCheck.user_id._id.toString());
  console.log("check 2");

  try {
    if (commentToCheck === null) {
      console.log("could not find a comment");
      res.status(400).json({ error: "did not find a comment" });
      return;
    }
    if (
      decodedJwt.payload._id.toString() ===
      commentToCheck.user_id._id.toString()
    ) {
      console.log("success - moving on!");
      next();
    } else {
      res.status(401).json({ authorized: false });
    }
  } catch (err) {
    console.log("in the error catch of comment auth middleware");
    console.log(err);
    res
      .status(400)
      .json(
        "something went wrong at the end in comment authorized middleware" + err
      );
  }
};

module.exports = {
  authorizeComment,
};
