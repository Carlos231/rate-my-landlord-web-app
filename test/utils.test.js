const express = require('express');
const passport = require('passport');
const request = require('supertest');

const chai = require('chai');

const chaiHttp = require('chai-http');
const isLoggedIn = require('../utils/isLoggedIn');
const checkCommentOwner = require('../utils/checkCommentOwner');

let app;

chai.use(chaiHttp);
chai.use(require('chai-as-promised'));

/*
 * Test Review
 */
describe('Utils', () => {
    /*
    * Test helper functions
    */
    describe('#isLoggedIn', () => {
        it('should send user to home page when user is logged in in', (done) => {
            app = express();
            app.use(passport.initialize());
            app.use(passport.session());
            app.use((req, res, next) => {
                req.isAuthenticated = function () {
                    return true;
                };
                req.user = {
                    _id: '602ccd76b98b9800f8c393f3',
                    username: 'car',
                    email: 'something@gmail.com',
                };
                req.flash = function (err, message) { };

                isLoggedIn(req, res, next);
            });
            app.get('/', (req, res) => {
                done();
            });

            request(app)
                .get('/')
                .expect(302)
                .expect('Location', '/')
                .end(done);
        });

        it('should redirect back to login page when user is not logged in', (done) => {
            app = express();
            app.use(passport.initialize());
            app.use(passport.session());
            app.use((req, res, next) => {
                req.isAuthenticated = function () {
                    return false;
                };
                req.flash = function (err, message) { };

                isLoggedIn(req, res, next);
            });
            app.get('/', () => {
                done();
            });

            request(app)
                .get('/')
                .expect(302)
                .expect('Location', '/login')
                .end(done);
        });
    });

    describe('#checkCommentOwner', () => {
        it('should only allow the owner to manipulate comment');
        // , (done) => {
        //     app = express();
        //     app.use(passport.initialize());
        //     app.use(passport.session());
        //     app.use(async (req, res, next) => {
        //         req.params.commentId = '602ccd76b98b9800f8c393f3';
        //         req.isAuthenticated = function () {
        //             return true;
        //         };
        //         req.user = {
        //             _id: '602ccd76b98b9800f8c393f3',
        //             username: 'car',
        //             email: 'something@gmail.com',
        //         };

        //         const comments = { user: { id: '602ccd76b98b9800f8c393f3' } };

        //         req.flash = function (err, message) { };
        //         try {
        //             await checkCommentOwner(req, res, next, comments);
        //         } catch (error) {
        //             console.log(error);
        //         }
        //         next();
        //     });
        //     app.get('/', () => {
        //         done();
        //     });

        //     request(app)
        //         .get('/')
        //         .expect(302)
        //         .expect('Location', 'back')
        //         .end(done);
        // });

        it('should redirect back a page if not owner of the comment');
    });

    describe('#checkLandlordOwner', () => {
        it('should only allow the owner to manipulate landlord');
    });
});
