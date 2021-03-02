const assert = require('assert');
const chai = require('chai');
const expect = require('chai').expect;
const request = require('supertest');
const app = require("../app");
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

const User = require('../models/user');

/*
 * Test the /GET/landlords route
 */
describe('Authentication routes', () => {
    /*
    * Test the /singup routes
    */
    describe("/signup routes", function () {
        let user;

        it("it should GET sign up page", () => {
            request(app).get('/signup')
                .then((res) => {
                    expect(res).to.not.be.empty;
                    expect(res.statusCode).to.equal(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    expect(res.text).to.contain('Express');
                    done()
                })
                .catch((err) => done(err))
        });

        it("successfully signs up then redirect to landlords page", (done) => {
            request(app)
                .post('/signup')
                .type('form')
                .send({
                    username: 'test',
                    email: 'test@gmail.com',
                    password: 'dev'
                })
                .end((err, res) => {
                    user = res.body
                    expect(res.status).to.eq(302);
                    expect('Location', '/landlords');
                    done()
                })
        });

        it("error when not a new user", (done) => {
            request(app)
                .post('/signup')
                .type('form')
                .send({
                    username: 'car',
                    email: 'something@gmail.com',
                    password: 'los'
                })
                .expect(302)
                .expect('Location', '/signup')
                .end(done)
        });

        it('removes the test user', (done) => {
            User.findOneAndRemove({ username: 'test' })
                .then(() => User.findOne({ username: 'test' }))
                .then((user) => {
                    assert(user === null);
                    done();
                });
        });
    });

    /*
    * Test the /login routes
    */
    describe("/login routes", function () {
        it("it should GET login page", () => {
            request(app).get('/login')
                .then((res) => {
                    expect(res).to.not.be.empty;
                    expect(res.statusCode).to.equal(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    expect(res.text).to.contain('Express');
                    done()
                })
                .catch((err) => done(err))
        });

        it("successfully POST loggedin then redirect to homepage", (done) => {
            request(app)
                .post('/login')
                .type('form')
                .send({ username: 'car', password: 'los' })
                .expect(302)
                .expect('Location', '/')
                .end(done)
        });

        it("it should GET logout page on logout success", () => {
            request(app).get('/logout')
                .then((res) => {
                    expect(res).to.not.be.empty;
                    expect(res.statusCode).to.equal(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    expect(res.text).to.contain('Express');
                    done()
                })
                .catch((err) => done(err))
        });

        it("does not POST login then redirect to login page", (done) => {
            request(app)
                .post('/login')
                .type('form')
                .send({ username: 'asdae', password: 'los' })
                .expect(302)
                .expect('Location', '/login')
                .end(done)
        });
    });

});


