const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: [true, "A first name is required!"],
        minlength: [3, "The first name must be at least 3 characters."]
    },

    lastName: {
        type: String,
        required: [true, "A last name is required!"],
        minlength: [3, "The last name must be at least 3 characters."]
    },

    email: {
        type: String,
        required: [true, "Email address is required!"],
        unique: [true, "The email is already registered with another user..."]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Passwords must be at least 8 characters!"]
    },
}, {timestamps: true})

UserSchema.virtual("confirmPassword")
    .get(()=>this._confirmPassword)
    .set((value)=>this._confirmPassword = value)

UserSchema.pre("validate", function(next){
    if(this.password !== this.confirmPassword){
        this.invalidate("confirmPassword", "Passwords must match!")
        console.log("Passwords don't match")
    }

    next()
})

UserSchema.pre("save", function(next){
    console.log("In pre save")
    bcrypt.hash(this.password, 10)
        .then((hashedPassword)=>{
        this.password = hashedPassword;
        next()
        })
})

const User = mongoose.model("User", UserSchema);
UserSchema.plugin(uniqueValidator, {message: "The email is already registered with another user..."});

module.exports = User;
