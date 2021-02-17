const assert = require('assert');
const expect = require('chai').expect;
const request = require('supertest');
const app = require("../app");

const Comment = require('../models/comment');

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