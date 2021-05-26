const mongoose = require('mongoose');

const landlordSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    business: String,
    type: String,
    isOwner: Boolean,
    img: String,
    img_description: String,
    owner: {
        // establish relationship
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        username: String,
    },
    reviews: [{
        name: {
            type: String,
        },
        content: {
            type: String,
        },
    }],
});

landlordSchema.index({
    '$**': 'text',
});

const Landlord = mongoose.model('landlord', landlordSchema);

async function getLandlords() {
    try {
        const landlords = await Landlord.find().exec();
        return landlords;
    } catch (error) {
        throw new Error('Error finding all landlords. More info: ', error);
    }
}

/**
 * getLandlordsByPage() returns indexed landlords
 * based on the passed-in page number, number per page and a filter for each to match to
 */
async function getLandlordsByPage(page, perPage, filter = {}) {
    try {
        const count = await Landlord.countDocuments(filter);
        const landlords = await Landlord.find(filter)
            .sort({ _id: 1 })
            .skip(page > 0 ? ((page - 1) * perPage) : 0)
            .limit(perPage)
            .exec();
        return [landlords, count];
    } catch (error) {
        throw new Error('Error retrieving landlords by page. More info: ', error);
    }
}

async function getLandlordById(id) {
    try {
        const landlord = await Landlord.findById(id).exec();
        return landlord;
    } catch (error) {
        throw new Error('Error retrieving landlord by id. More info: ', error);
    }
}

async function deleteLandlord(id) {
    try {
        await Landlord.findByIdAndDelete(id).exec();
    } catch (error) {
        throw new Error('Error deleting landlord. More info:', error);
    }
}

async function addLandlord(newLandlord) {
    try {
        const landlord = await Landlord.create(newLandlord);
        return landlord;
    } catch (error) {
        throw new Error('Error adding a new landlord. More info:', error);
    }
}

async function updateLandlord(id, updatedData) {
    try {
        await Landlord.findByIdAndUpdate(id, updatedData, {
            // see object after is updates (3rd param)
            new: true,
        }).exec();
    } catch (error) {
        throw new Error('Error updating landlord. More info: ', error);
    }
}

module.exports = {
    Landlord,
    getLandlords,
    getLandlordsByPage,
    getLandlordById,
    deleteLandlord,
    addLandlord,
    updateLandlord,
};
