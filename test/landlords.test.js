let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

const request = require('supertest');

chai.use(chaiHttp);

/*
 * Test the /GET/landlords route
 */
describe('Landlords routes', () => {
    /*
    * Test the /GET/landlord/:id route
    */
    describe("GET: /landlords", function () {
        it("it should GET all the landlords", () => {
            request(app).get('/landlords')
                .then((res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res).to.not.be.empty;
                    done()
                })
                .catch((err) => done(err))
        });
    });

    /*
    * Test the /GET/landlord/:id route
    */
    // Add a new landlord
});


