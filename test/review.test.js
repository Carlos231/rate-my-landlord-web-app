const assert = require('assert');
const expect = require('chai').expect;
const request = require('supertest');
const app = require("../app");

const Comment = require('../models/comment');

/*
 * Test Review
 */
describe("Reviews", () => {
    /*
    * Test helper functions
    */
    describe("#getComments", function () {
        it("should return all of the comments");
    });

    describe("#getCommetsById", function () {
        it("should return the comment by Id");
    });

    describe("#addComment", function () {
        it("should add a new comment to landlord");
    });

    describe("#updateComment", function () {
        it("should update the comment by Id");
    });

    describe("#deleteComment", function () {
        it("should delete the comment by Id");
    });
})

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