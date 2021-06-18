const assert = require('assert');
const chai = require('chai');
const { expect } = require('chai');
const request = require('supertest');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.use(require('chai-as-promised'));

const { User, createNewUser } = require('../models/user');

/*
 * Test Authentication
 */
describe('Authentication', () => {
    /*
    * Test helper functions
    */
    describe('#createNewUser', () => {
        it('should create a new user and return it', async () => {
            const newUser = await createNewUser('testuser', 'user@test.com', 'testPassword');

            chai.assert.isDefined(newUser);
            chai.assert.isObject(newUser);
            chai.assert.propertyVal(newUser, 'username', 'testuser');
            chai.assert.propertyVal(newUser, 'email', 'user@test.com');
        });

        it('should throw an Error if value is missing from new user', async () => {
            await chai.expect(createNewUser('testuser', 'user@test.com')).to.be.rejectedWith(Error);
        });
    });

    /*
    * Test the /singup routes
    */
    describe('/signup routes', () => {
        let user;

        it('should GET sign up page', () => {
            request(app).get('/signup')
                .then((res) => {
                    expect(res).to.not.be.empty;
                    expect(res.statusCode).to.equal(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    expect(res.text).to.contain('Express');
                    done();
                })
                .catch((err) => done(err));
        });

        it('successfully signs up then redirect to landlords page', (done) => {
            request(app)
                .post('/signup')
                .type('form')
                .send({
                    username: 'testuser',
                    email: 'user@test.com',
                    password: 'testPassword',
                })
                .end((err, res) => {
                    user = res.body;
                    expect(res.status).to.eq(302);
                    expect('Location', '/landlords');
                    done();
                });
        });

        it('error when not a new user', (done) => {
            request(app)
                .post('/signup')
                .type('form')
                .send({
                    username: 'car',
                    email: 'something@gmail.com',
                    password: 'los',
                })
                .expect(302)
                .expect('Location', '/signup')
                .end(done);
        });

        it('removes the test user', (done) => {
            User.findOneAndRemove({ username: 'testuser' })
                .then(() => User.findOne({ username: 'testuser' }))
                .then((user) => {
                    assert(user === null);
                    done();
                });
        });
    });

    /*
    * Test the /login routes
    */
    describe('/login routes', () => {
        it('should GET login page', () => {
            request(app).get('/login')
                .then((res) => {
                    expect(res).to.not.be.empty;
                    expect(res.statusCode).to.equal(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    expect(res.text).to.contain('Express');
                    done();
                })
                .catch((err) => done(err));
        });

        it('successfully POST loggedin then redirect to homepage', (done) => {
            request(app)
                .post('/login')
                .type('form')
                .send({ username: 'car', password: 'los' })
                .expect(302)
                .expect('Location', '/')
                .end(done);
        });

        it('should GET logout page on logout success', () => {
            request(app).get('/logout')
                .then((res) => {
                    expect(res).to.not.be.empty;
                    expect(res.statusCode).to.equal(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    expect(res.text).to.contain('Express');
                    done();
                })
                .catch((err) => done(err));
        });

        it('does not POST login then redirect to login page', (done) => {
            request(app)
                .post('/login')
                .type('form')
                .send({ username: 'asdae', password: 'los' })
                .expect(302)
                .expect('Location', '/login')
                .end(done);
        });
    });
});
