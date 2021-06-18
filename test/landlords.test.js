const assert = require('assert');
const chai = require('chai');
const { expect } = require('chai');
const request = require('supertest');
const chaiHttp = require('chai-http');
const app = require('../app');

const {
    Landlord,
    getLandlords,
    getLandlordsByPage,
    addLandlord,
    getLandlordById,
    updateLandlord,
    deleteLandlord,
} = require('../models/landlord');

chai.use(chaiHttp);
chai.use(require('chai-as-promised'));

/*
 * Test Landlords
 */
describe('Landlords', () => {
    /*
    * Test helper functions
    */
    let countAllLandlords = 0;
    let landlordId = 0;
    const landlord = {
        name: 'Test',
        phone: '555-555-5555',
        email: 'email@test.com',
        address: 'Test Avenue, Test, OR, USA',
        business: 'Test business',
        type: 'apartment',
        isOwner: true,
        img: 'http://someimageurl.com',
        img_description: 'Test image description',
        owner: {
            id: '602ccd76b98b9800f8c393f3',
            username: 'car',
        },
    };

    before(async () => {
        countAllLandlords = await Landlord.countDocuments();

        // sign in a user to test routes
    });

    describe('#getLandlords', () => {
        it('should retrieve all landlords', async () => {
            const landlords = await getLandlords();

            chai.assert.isDefined(landlords);
            chai.assert.isArray(landlords);
            chai.assert.isObject(landlords[0]);
            chai.assert.lengthOf(landlords, countAllLandlords);
        });
    });

    describe('#getLandlordsByPage', () => {
        it('should retrieve 2 landlords by page number', async () => {
            const [landlords, count] = await getLandlordsByPage(1, 2);

            chai.assert.isDefined(landlords);
            chai.assert.isArray(landlords);
            chai.assert.isObject(landlords[0]);
            chai.assert.lengthOf(landlords, 2);
            chai.assert.equal(count, countAllLandlords);
        });
    });

    describe('#addLandlord', async () => {
        it('should add new landlord', async () => {
            const newLandlord = await addLandlord(landlord);
            landlordId = newLandlord._id;

            chai.assert.isDefined(newLandlord);
            chai.assert.isObject(newLandlord);
            chai.assert.propertyVal(newLandlord, 'name', 'Test');
            // chai.assert.deepPropertyVal(newLandlord, 'owner.username', 'car');
        });

        // keep count of new landlord
        after(async () => {
            countAllLandlords = await Landlord.countDocuments();
        });
    });

    describe('#getLandlordById', () => {
        it('should retrieve landlords by Id', async () => {
            const retrievedLandlord = await getLandlordById(landlordId);

            chai.assert.isDefined(retrievedLandlord);
            chai.assert.isObject(retrievedLandlord);

            chai.assert.property(retrievedLandlord, '_id');
            chai.assert.equal(retrievedLandlord._id.toString(), landlordId.toString());

            chai.assert.propertyVal(retrievedLandlord, 'name', 'Test');
            chai.assert.propertyVal(retrievedLandlord.owner, 'username', 'car');
        });
    });

    describe('#updateLandlord', () => {
        const updatedLandlord = {
            name: 'test',
            phone: '555-555-5555',
            email: 'email@test.com',
            address: 'Test Avenue, Test, OR, USA',
            business: 'Test business',
            type: 'house',
            isOwner: false,
            img: 'http://someimageurl.com',
            img_description: 'Test image description',
            owner: {
                id: '602ccd76b98b9800f8c393f3',
                username: 'car',
            },
        };

        it('should update the landlord by Id', async () => {
            const updatedL = await updateLandlord(landlordId, updatedLandlord);

            chai.assert.isDefined(updatedL);
            chai.assert.isObject(updatedL);
            chai.assert.isFalse(updatedL.isOwner);

            chai.assert.propertyVal(updatedL, 'name', 'test');
        });
    });

    describe('#deleteLandlord', () => {
        it('should delete the landlord by id', async () => {
            await deleteLandlord(landlordId);
            const findUser = await getLandlordById(landlordId);

            chai.assert.isNull(findUser);
        });

        // it('should throw error trying to delete invalid landlord Id', async () => {
        //     await chai.expect(deleteLandlord(landlordId)).to.be.rejectedWith(Error);
        // });
    });

    /*
    * Test landlord routes
    */
    describe('GET: /landlords', () => {
        it('should GET all the landlords', () => {
            request(app).get('/landlords')
                .then((res) => {
                    expect(res).to.not.be.empty;
                    expect(res.statusCode).to.equal(200);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('GET: /landlords/pages/:page', () => {
        it('should render a page some of the landlords');
    });

    describe('GET: /landlords/new', () => {
        it('should render a form for new landlord');
    });

    describe('POST: /landlords', () => {
        it('should send the from data for a new landlord');
    });

    describe('GET: /landlords/search', () => {
        it('should render page with landlords matching search query');

        const searchTerm = 'em';
        request(app).get(`/landlords/search?term=${searchTerm}`)
            .then((res) => {
                expect(res).to.not.be.empty;
                expect(res.statusCode).to.equal(200);
                expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                expect(res.text).to.contain('Emily Heart');
                done();
            })
            .catch((err) => done(err));
    });

    describe('GET: /landlords/type/:type', () => {
        it('should show render page with landlords matching type');
    });

    describe('GET: /landlords/:id', () => {
        it('should render view for landlord by id');
    });

    describe('GET: /landlords/:id/edit', () => {
        it('should render edit page for landlord by id');
    });

    describe('PUT: /landlords/:id', () => {
        it('should send edited form data for landlord by id');
    });

    describe('DELETE: /landlords/:id', () => {
        it('should delete a landlord by id');
    });

    // describe("Test", function () {
    //     it("this is a test", (done) => {
    //         done();
    //     });
    // });

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
});
