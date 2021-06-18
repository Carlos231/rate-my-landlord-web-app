const chai = require('chai');

const should = chai.should();
const app = require('../app');

const User = require('../models/user');

chai.use(require('chai-as-promised'));

/*
 * Test Account
 */
describe('Account', () => {
    /*
    * Test helper functions
    */
    let landlordsId = 0;

    before(async () => {
        const landlord = {
            email: 'user@test.com',
            username: 'testuser',
            password: 'testPassword',
        };

        // eslint-disable-next-line max-len
        const newUser = await User.createNewUser(landlord.username, landlord.email, landlord.password);

        landlordsId = newUser._id;
        // console.log(landlordsId);
    });

    // after(async () => {
    //     await User.deleteUserAccount(landlordsId);
    //     // console.log('Landlord deleted.');
    // });

    describe('#findUserById', () => {
        it('should return the users account data', async () => {
            const foundUser = await User.findUserById(landlordsId);

            chai.assert.isDefined(foundUser);
            chai.assert.isObject(foundUser);
            chai.assert.propertyVal(foundUser, 'email', 'user@test.com');
            chai.assert.propertyVal(foundUser, 'username', 'testuser');
        });
    });

    describe('#deleteUserAccount', () => {
        it('should delete the users account', async () => {
            await User.deleteUserAccount(landlordsId);
            const findUser = await User.findUserById(landlordsId);

            chai.assert.isNull(findUser);
        });

        it('should throw error when try to delete invalid user id', async () => {
            await chai.expect(User.deleteUserAccount(234341)).to.be.rejectedWith(Error);
        });
    });

    describe('/:id GET', () => {
        it('should render the users accounts page', (done) => {
            chai.request(app)
                .get(`/accounts/${landlordsId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});
