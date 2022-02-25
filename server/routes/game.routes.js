const GameController = require("../controllers/game.controller");

// add in the JWT middleware function "authenticate" - we named it in the jwt.config.js
const { authenticate } = require("../config/jwt.config");
// add in the auth middleware function "authorize" - we named it in the auth.config.js
const { authorize } = require("../config/auth.config");

module.exports = (app) => {
  app.get("/api/games", GameController.getAllGames);
  app.get("/api/games/:id", GameController.findOneGame);
  app.get("/api/user/games/:userId", GameController.getAllGamesByUser);

  // Routes that need authentication and authorization (maybe)
  app.post("/api/games", authenticate, GameController.createNewGame);
  app.put("/api/games/:id", authenticate, authorize, GameController.updateGame);
  app.delete(
    "/api/games/:id",
    authenticate,
    authorize,
    GameController.deleteGame
  );
  app.put("/api/like/games/:id", authenticate, GameController.likeGame);
  app.put(
    "/api/removelike/games/:id",
    authenticate,
    GameController.removeGameLike
  );
};
