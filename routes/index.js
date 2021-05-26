const express = require('express');

const router = express.Router();

const { getLandlords } = require('../models/landlord');

// Config Import
const KEY = process.env.MAPSAPI;

// index
router.get('/', async (req, res, next) => {
    try {
        const landlords = await getLandlords();

        res.status(200).render('landing', {
            landlords,
            KEY,
        });
    } catch (err) {
        console.log('Broken.. /index GET');
        req.flash('error', 'Error fetching landlords');
        next(err);
    }
});

module.exports = router;
