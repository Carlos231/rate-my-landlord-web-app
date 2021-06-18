const assert = require('assert');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');

const Comment = require('../models/comment');

/*
 * Test landing page
 */
describe('Landing', () => {
    /*
    * Test the /GET/ landing page route
    */
    describe('GET: /landing page', () => {
        it('should render the landing page with db values', () => {
            request(app).get('/')
                .then((res) => {
                    expect(res).to.not.be.empty;
                    expect(res.statusCode).to.equal(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    expect(res.text).to.contain('Express');
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
