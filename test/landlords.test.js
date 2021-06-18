const assert = require('assert');
const chai = require('chai');
const expect = require('chai').expect;
const request = require('supertest');
const app = require("../app");
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

/*
 * Test the /GET/landlords route
 */
describe('/landlords routes', () => {
    /*
    * Test the /GET/landlord/:id route
    */
    describe("GET: /landlords", function () {
        it("should GET all the landlords", () => {
            request(app).get('/landlords')
                .then((res) => {
                    expect(res).to.not.be.empty;
                    expect(res.statusCode).to.equal(200);
                    done()
                })
                .catch((err) => done(err))
        });
    });

    // Need to log in before so that sign in a user in order to do crud operations

    /*
    * Test the /GET/landlord/:id route
    */
    // describe("POST: /landlords", function () {
    //     let landlord;
    //     it("should POST a new landlord", (done) => {
    //         request(app)
    //             .post('/signup')
    //             .type('form')
    //             .send({
    //                 name: 'test',
    //                 phone: '555-555-5555',
    //                 email: 'something@gmail.com',
    //                 address: 'Northwest Jackson Avenue, Corvallis, OR, USA',
    //                 business: 'Drive in LLC',
    //                 type: 'Apartments',
    //                 owner: 'true',
    //                 img: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1347&q=80',
    //                 img_description: 'Image description'
    //             })
    //             .end((err, res) => {
    //                 landlord = res.body;
    //                 expect(res.status).to.eq(302);
    //                 expect('Location', `/landlords/${landlord._id}`);
    //                 done()
    //             })
    //     });
    // });

    /*
    * Test the /GET/landlord/new route
    */
    // describe("GET: /new landlords form", function () {
    //     it("should GET the form for a new landlord", (done) => {
    //         request(app).get('/landlords/new')
    //             .then((res) => {
    //                 expect(res).to.not.be.empty;
    //                 expect(res.statusCode).to.equal(200);
    //                 expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
    //                 // expect(res.text).to.contain('Express');
    //                 done()
    //             })
    //             .catch((err) => done(err))
    //     })
    // })

    /*
    * Test the /GET/landlord/new route
    */
    describe("GET: /search landlords", function () {
        it("should GET the search results", (done) => {
            const searchTerm = "em";
            request(app).get(`/landlords/search?term=${searchTerm}`)
                .then((res) => {
                    expect(res).to.not.be.empty;
                    expect(res.statusCode).to.equal(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    expect(res.text).to.contain('Emily Heart');
                    done()
                })
                .catch((err) => done(err))
        })
    })

});

