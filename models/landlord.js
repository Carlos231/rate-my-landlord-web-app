const mongoose = require('mongoose');

const landlordSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    business: String,
    type: String,
    owner: Boolean,
    img: String,
    img_description: String,
    owner: {
        // establish relationship
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    reviews: [{
        name: {
            type: String
        },
        content: {
            type: String
        }
    }]
})

landlordSchema.index({
    '$**': 'text'
});

const Landlord = mongoose.model("landlord", landlordSchema);

module.exports = Landlord;