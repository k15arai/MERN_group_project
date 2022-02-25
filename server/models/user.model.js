const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const UserSchema = new mongoose.Schema(
{
    firstName: {
    type: String,
    required: [true, "First name is required"],
    },
    lastName: {
    type: String,
    required: [true, "Last name is required"],
    },
    email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
        // regular expressions (regex) create patterns that we must match
        // using an anonymous function to run the validation test method
        validator: (val) => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
        message: "Please enter a valid email",
    },
    },
    password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be 6 characters or longer"],
    },
},
{ timestamps: true }
);

// create a "virtual" field that can be compared / validated to
// does not get added to the database when it is saved
// this will create the getter and setter methods for the confirmationPassword field
UserSchema.virtual("confirmPassword")
.get(() => this._confirmPassword)
.set((value) => (this._confirmPassword = value));

// This is where the validation / comparison actually happens
// the pre "hook" allows it to run before any other validations
UserSchema.pre("validate", function (next) {
if (this.password !== this.confirmPassword) {
    this.invalidate("confirmPassword", "Password must match confirm password");
}
  next(); // successfully compared - move on to the next step in the validation process
});

// We must hash / encrypt the password prior to saving it to the database
// we replace the original password value with the hashed / encrypted password
// that we just created
UserSchema.pre("save", function (next) {
bcrypt.hash(this.password, 10).then((hash) => {
    this.password = hash;
    next();
});
});

// this will create a new collection in our DB called "users"
// it will lower case our string and make it plural "automatically" for us
const User = mongoose.model("User", UserSchema);
module.exports = User;
