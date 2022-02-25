const Game = require('../models/game.model');
const jwt = require('jsonwebtoken');

module.exports = {

    //Find all games
    getAllGames: (req, res)=>{
        Game.find()
            .populate("createdBy", "firstName lastName" )
            .then((allGames)=>{
                console.log(allGames);
                res.json(allGames);
            })
            .catch((err)=>{
                console.log("Get all games failed");
                res.json({message: "Something went wrong with GetAll, ", error: err})
            })
    },

    //Create a new game
    createNewGame: (req, res)=>{
        const newGameObject = new Game(req.body);

        //gives access to the user information stored in the cookie
        newGameObject.createdBy = req.jwtpayload.id;

        newGameObject.save(req.body)
            .then((newGame)=>{
                console.log(newGame);
                res.json(newGame)
            })
            .catch((err)=>{
                console.log('Something went wrong in createNewGame');
                res.status(400).json(err);
            })
    },

    //Get one game
    findOneGame: (req,res)=>{
        Game.findOne({_id: req.params.id})
            .then((oneGame)=>{
                console.log(oneGame);
                res.json(oneGame)
            })
            .catch((err)=>{
                console.log('Find one game failed!');
                res.json({message: 'Something went wrong in findOneGame ', error: err})
            })
    },

    //Delete a game
    deleteGame: (req, res)=>{
        Game.deleteOne({_id: req.params.id})
            .then((deletedGame)=>{
                console.log(deletedGame);
                res.json(deletedGame)
            })
            .catch((err)=>{
                console.log('Delete one game failed');
                res.json({message: 'Something went wrong in deleteGame ', error: err})
            })
    },

    //Updating a game
    updateGame: (req, res)=>{
        Game.findOneAndUpdate({_id: req.params.id},
            req.body,
            {new: true, runValidators: true}
            )
            .then((updatedGame)=>{
                console.log(updatedGame);
                res.json(updatedGame)
            })
            .catch((err)=>{
                console.log('Something went wrong in updateGame');
                res.status(400).json(err);
            })
    }
}