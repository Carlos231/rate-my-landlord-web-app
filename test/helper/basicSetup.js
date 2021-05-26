const mongoose = require('mongoose');

const basicSetup = () => {
    before((done) => { // runs before the first test case
        mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        }) // connection to the data base
            .once('open', () => done())
            .on('error', (error) => done(error));
    });
    beforeEach((done) => { // runs before each test case
        mongoose.connection.db.listCollections({ landlords: 'landlords' })
            .next((error, collection) => { // deleting the collection before each
                if (collection) { // test case to avoid duplicated key error
                    mongoose.connection.db.dropCollection('landlords')
                        .then(() => done())
                        .catch((err) => done(err));
                } else {
                    done(error);
                }
            });
    });

    after((done) => { // runs after the last test case
        mongoose.disconnect()
            .then(() => done())
            .catch((err) => done(err));
    });
};

module.exports = basicSetup;
