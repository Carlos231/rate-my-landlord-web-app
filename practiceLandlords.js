const config = require('./config.js');
const mongoose = require('mongoose');
const {
    url
} = require('inspector');
mongoose.connect(config.db.connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// what data should look like
const landLordsSchema = new mongoose.Schema({
    name: String,
    business: String,
    img: String,
    img_description: String
});

// put the databases collection name in model
const LandLord = mongoose.model("land-lords", landLordsSchema);

const firstOne = new LandLord({
    name: "Carlos",
    business: "CELM Enterprise",
    img: "some pictues",
    img_description: "None exisiting picture"
})

// first way
// save document to database
// firstOne.save((err, landLord) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(landLord);
//     }
// });

// second way - watchout for "callout hell"
// LandLord.create(firstOne, (err, car) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(landLord);
//     }
// })

// third and best way (based on promises)
LandLord.create(firstOne)
    .then((err, item) => {
        if (err) {
            console.log(err);
        } else {
            console.log(landLord);
            // return item
        }
    })
// .then(()) go on next level...

// retreive information
LandLord.find()
    .exec() // Execute our query, returning a promise
    .then((foundLandlords) => {
        console.log(foundLandlords);
        // console.log(foundLandlords[0].name);
        // can query db then render that information
        // res.render("landLords", {
        //     foundLandlords
        // })
    })
    .catch((err) => {
        console.log("Error!" + err);
    })

// find scpecific db value
LandLord.findById("5f6829b8a0494b41105ff9ad")
    .exec() // Execute our query, returning a promise
    .then((foundLandlord) => {
        console.log(foundLandlord);
    })
    .catch((err) => {
        console.log("Error!" + err);
    })