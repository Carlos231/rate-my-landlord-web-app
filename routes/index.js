const express = require('express');
const router = express.Router();

const Landlord = require('../models/landlord');

const isLoggedIn = require('../utils/isLoggedIn');

// Config Import
let KEY = process.env.MAPSAPI;

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