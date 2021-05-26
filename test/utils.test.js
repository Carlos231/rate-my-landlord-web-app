const assert = require('assert');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');

/*
 * Test Review
 */
describe('Utils', () => {
    /*
    * Test helper functions
    */
    describe('#checkCommentOwner', () => {
        it('should only allow the owner to manipulate comment');
    });

    describe('#checkLandlordOwner', () => {
        it('should only allow the owner to manipulate landlord');
    });
});
