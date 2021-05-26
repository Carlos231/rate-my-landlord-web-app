const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        // establish relationship
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        username: String,
    },
    text: String,
    landlordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Landlord',
    },
});

const Comment = mongoose.model('comment', commentSchema);

async function getComments(landlordsId = {}) {
    try {
        const comments = await Comment.find(landlordsId).exec();
        return comments;
    } catch (error) {
        throw new Error('Error retrieving all comments. More info: ', error);
    }
}

async function getCommetsById(id) {
    try {
        const comments = await Comment.findById(id).exec();
        return comments;
    } catch (error) {
        throw new Error('Error retrieving comments for Id. More info: ', error);
    }
}

async function addComment(commentBody) {
    try {
        await Comment.create(commentBody);
    } catch (error) {
        throw new Error('Error adding a new comment. More info:', error);
    }
}

async function updateComment(commentId, updatedBody) {
    try {
        await Comment.findByIdAndUpdate(commentId, updatedBody, {
            new: true,
        });
    } catch (error) {
        throw new Error('Error updating comment. More info: ', error);
    }
}

async function deleteComment(commentId) {
    try {
        await Comment.findByIdAndDelete(commentId);
    } catch (error) {
        throw new Error('Error deleting comment. More info: ', error);
    }
}

module.exports = {
    Comment,
    getComments,
    getCommetsById,
    addComment,
    updateComment,
    deleteComment,
};
