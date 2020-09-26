const mongoose = require("mongoose");
//const validator = require("validator");
const bcrypt = require("bcryptjs");

// Making a Mongoose model a little differently: a Mongoose Schema
// Allows us to add additional functionality.
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        //validate: { // We can't use a validator here because we need the default admin and user accounts...it hurts
        //    validator: passwordValidator,
        //},
    },
    shared: {
        type: Array,
        // required: true,
    },
    reports: {
        type: Array,
    },
    preferences: {
        currentLeftMenuView: String,
        currentRightMenuView: String,
        leftMenuCollapsed: Boolean,
        rightMenuCollapsed: Boolean
    }
});

// Mongoose middleware to encrypt the password before saving to the database.
UserSchema.pre("save", function (next) {
    const user = this; // Binds this to User document instance

    // Ensure that we don't hash the password more than once
    if (user.isModified("password")) {
        // Generate salt and hash the password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

// A static method on the document model.
// Allows us to find a User document by comparing the hashed password
// to a given one, for example when logging in.
UserSchema.statics.findByUserPassword = function (username, password) {
    const User = this; // Binds this to the User model

    // First find the user by their email
    return User.findOne({ username: username }).then((user) => {
        if (!user) {
            return Promise.reject("User doesn't exist"); // a rejected promise
        }

        // if the user exists, make sure their password is correct
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    resolve(user);
                } else {
                    reject("Password invalid");
                }
            });
        });
    });
};

// make a model using the User schema
const User = mongoose.model("User", UserSchema);
module.exports = { User };

