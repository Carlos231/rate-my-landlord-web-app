const assert = require('assert');
const chai = require('chai');
const expect = require('chai').expect;
const request = require('supertest');
const app = require("../app");
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

/*
 * Test Account
 */
describe("Account", function () {
    /*
    * Test helper functions
    */
    describe("#findUserById", function () {
        it("should return the users account data");
        it("should not return a user from an invalid Id");
    });


    describe("/:id GET", function () {
        it("should render the accounts info page");

        it("should delete the account");
    });

});