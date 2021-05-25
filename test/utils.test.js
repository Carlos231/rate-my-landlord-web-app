const assert = require('assert');
const expect = require('chai').expect;
const request = require('supertest');
const app = require("../app");

/*
 * Test Review
 */
describe("Utils", () => {
    /*
    * Test helper functions
    */
    describe("#checkCommentOwner", function () {
        it("should only allow the owner to manipulate comment");
    });

    describe("#checkLandlordOwner", function () {
        it("should only allow the owner to manipulate landlord");
    });
})