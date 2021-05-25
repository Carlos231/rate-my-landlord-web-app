const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("user", userSchema);

const User = mongoose.model("user", userSchema);

async function createNewUser(username, email, password) {
    try {
        const newUser = await User.register(new User({
            username: username,
            email: email
        }), password);
        return newUser;
    } catch (error) {
        throw new Error("Error creating new user. More info: ", error);
    }
}

async function findUserById(id) {
    try {
        const user = await User.findById(id).exec();
        return user;
    } catch (error) {
        throw new Error("Error finding the user by Id. More info: ", error);
    }
}

async function deleteUserAccount(id) {
    try {
        const deletedUser = await User.findByIdAndDelete(id).exec();
    } catch (error) {
        throw new Error("Error deleting user. More info: ", error);
    }
}

module.exports = {
    User,
    createNewUser,
    findUserById,
    deleteUserAccount,
};