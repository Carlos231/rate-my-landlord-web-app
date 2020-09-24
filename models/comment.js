const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        // establish relationship
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    text: String,
    landlordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Landlord"
    }
})

module.exports = mongoose.model("comment", commentSchema);