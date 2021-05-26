const assert = require('assert');
const chai = require('chai');
const { expect } = require('chai');
const request = require('supertest');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);

/*
 * Test Account
 */
describe('Account', () => {
    /*
    * Test helper functions
    */
    describe('#findUserById', () => {
        it('should return the users account data');
        it('should not return a user from an invalid Id');
    });

    describe('/:id GET', () => {
        it('should render the accounts info page');

        it('should delete the account');
    });
});
