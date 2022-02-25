const Comment = require('../models/comment.model');
const jwt = require('jsonwebtoken');

module.exports = {

    //Get all comments
    getAllComments: (req, res)=>{
        Comment.find()
            .populate('createdBy', 'firstName lastName')
            .sort({commentDate: 'descending'})
            .then((allComments)=>{
                console.log(allComments);
                res.json(allComments);
            })
            .catch((err)=>{
                console.log('Get all comments failed');
                res.json({message: 'Something went wrong with GetAll, ', error: err})
            })
    },

    //Create a new comment
    createNewComment: (req, res)=>{
        const newCommentObject = new Comment(req.body);

        newCommentObject.createdBy = req.jwtpayload.id;

        newCommentObject.save(req.body)
            .then((newComment)=>{
                console.log(newComment);
                res.json(newComment)
            })
            .catch((err)=>{
                console.log('Something went wrong in createNewComment');
                res.status(400).json(err);
            })
    },

    //Delete a comment
    deleteComment: (req, res)=>{
        Comment.deleteOne({_id: req.params.id})
            .then((deletedComment)=>{
                console.log(deletedComment);
                res.json(deletedComment)
            })
            .catch((err)=>{
                console.log('Delete one comment failed');
                res.json({message: 'Something went wrong in deleteComment ', error: err})
            })
    }
}