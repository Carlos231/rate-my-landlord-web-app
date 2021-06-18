const { assert } = require('chai');

const Landlord = require('../models/landlord');
const Comment = require('../models/comment');

/*
 * Test Review
 */
describe('Reviews', () => {
    let commentsCount;
    let firstLandlord;
    let newCommentId;

    before(async () => {
        // get a landlord info
        const landlords = await Landlord.getLandlords();
        firstLandlord = landlords[0];

        // count all of the comments
        const comments = await Comment.getComments();
        commentsCount = comments.length;
    });

    /*
    * Test helper functions
    */
    describe('#getComments', () => {
        it('should return all of the comments', async () => {
            const comments = await Comment.getComments();
            const firstComment = comments[0];
            assert.isArray(comments);
            assert.property(firstComment, 'user');
            assert.property(firstComment, 'text');
            assert.property(firstComment, 'landlordId');
            assert.lengthOf(comments, commentsCount);
        });

        it('should return all of the comments for landlord id', async () => {
            const comment = await Comment.getComments({
                landlordId: firstLandlord._id.toString(),
            });
            const firstComment = comment[0];

            assert.isDefined(comment);
            assert.isArray(comment);
            assert.lengthOf(comment, 3);

            assert.isObject(firstComment);
            assert.property(firstComment, 'user');
            assert.property(firstComment, 'text');
            assert.property(firstComment, 'landlordId');
        });
    });

    describe('#addComment', () => {
        it('should add a new comment to landlord', async () => {
            const newComment = await Comment.addComment({
                user: {
                    id: '602ccd76b98b9800f8c393f3',
                    username: 'car',
                },
                text: 'This is a test review.',
                landlordId: firstLandlord._id,
            });
            newCommentId = newComment._id;

            assert.isObject(newComment);
            assert.deepPropertyVal(newComment.user, 'username', 'car');
            assert.propertyVal(newComment, 'text', 'This is a test review.');
            assert.propertyVal(newComment, 'landlordId', firstLandlord._id);
        });
    });

    describe('#getCommentsById', () => {
        it('should return the comment by comment Id', async () => {
            const comment = await Comment.getCommentsById(newCommentId);

            assert.isObject(comment);
            assert.deepPropertyVal(comment.user, 'username', 'car');
            assert.deepPropertyVal(comment.landlordId, '_id', firstLandlord._id);
            assert.propertyVal(comment, 'text', 'This is a test review.');
        });
    });

    describe('#updateComment', () => {
        it('should update the comment by Id', async () => {
            const updatedComment = await Comment.updateComment(newCommentId, {
                user: {
                    id: '602ccd76b98b9800f8c393f3',
                    username: 'car',
                },
                text: 'This is the updated test review.',
                landlordId: firstLandlord._id,
            });

            assert.isDefined(updatedComment);
            assert.isObject(updatedComment);
            assert.deepPropertyVal(updatedComment.user, 'username', 'car');
            assert.propertyVal(updatedComment, 'text', 'This is the updated test review.');
        });
    });

    describe('#deleteComment', () => {
        it('should delete the comment by Id', async () => {
            await Comment.deleteComment(newCommentId);
            const findComment = await Comment.getCommentsById(newCommentId);

            assert.isNull(findComment);
        });
    });
});

// describe('Reviews routes', () => {

//     describe("POST: /review", function () {
//         const comment = new Comment({
//             landlordId: "601123ba7c623d31043272dd",
//             username: "gin",
//             text: "sucks"
//         });

//         it("should save a new review", () => {
//             comment.save().then(function () {
//                 assert(comment.isNew === false);
//                 console.log(comment)
//                 done();
//             });
//         });
//     });
// });
