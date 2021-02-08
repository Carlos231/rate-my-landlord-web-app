const express = require('express');
const router = express.Router();

const Landlord = require('../models/landlord');

const isLoggedIn = require('../utils/isLoggedIn');
let KEY;

// Config Import
try {
    const config = require('../config');
    KEY = config.googleMaps.KEY;
} catch (error) {
    console.log("Could not import config. Not working locally, error");
    KEY = process.env.MAPSAPI;
}

// index
router.get("/", async (req, res, next) => {
    try {
        const landlords = await Landlord.find().exec();

        res.status(200).render('landing', {
            landlords: landlords,
            KEY: KEY
        });
    } catch (err) {
        console.log('Broken.. /index GET');
        req.flash('error', 'Error fetching landlords');
        next(err);
    }
});

router.get("/account", isLoggedIn, (req, res, next) => {
    try {
        res.status(200).render('account');
    } catch (err) {
        console.log('Broken.. /account GET');
        next(err);
    }
})

module.exports = router;