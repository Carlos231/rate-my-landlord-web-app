const express = require('express');
const router = express.Router();

const Landlord = require('../models/landlord');

// Config Import
const KEY = process.env.MAPSAPI;

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

module.exports = router;