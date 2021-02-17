// const expect = require('chai').expect,
//     request = require('supertest'),
//     // basicSetup = require('./helper/basicSetup.js'),
//     // app = require('../app');

// describe('POST: /save route to insert data', () => {
//     basicSetup();         // imported from test/helpers/basicSetup.js

//     // it('valid data', (done) => {            // test case 1
//     //     let toSendData = { _id: 1, name: 'john doe', branch: 'computer science' }
//     //     request(app).post('/save')
//     //         .send(toSendData)
//     //         .then((res) => {
//     //             expect(res.statusCode).to.equal(201);
//     //             expect(res.body).to.include(toSendData);
//     //             done();
//     //         })
//     //         .catch((err) => done(err))
//     // })

//     it('no _id field given', (done) => {        // test case 2
//         request(app).get('/landlords')
//             .then((res) => {
//                 expect(res.statusCode).to.equal(500)
//                 expect(res.body).to.be.an('object')
//                 done()
//             })
//             .catch((err) => done(err))
//     })
// })

const assert = require('assert');
const expect = require('chai').expect;
const request = require('supertest');
const app = require("../app");

const Comment = require('../models/comment');

describe('Landing routes', () => {
    describe("GET: /landing page", function () {
        it("should render the landing page", () => {
            request(app).get('/')
                .then((res) => {
                    expect(res.statusCode).to.equal(200);
                    done()
                })
                .catch((err) => done(err))
        });
    });
});
