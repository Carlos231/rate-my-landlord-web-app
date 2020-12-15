const express = require('express');
const router = express.Router();

const isLoggedIn = require('../utils/isLoggedIn');
var KEY;

// Config Import
try {
    var config = require('../config');
    KEY = config.googleMaps.src;
} catch (error) {
    console.log("Could not import config. Not working locally, error");
    KEY = process.env.MAPSAPI;
}

// index
router.get("/", (req, res, next) => {
    try {
        res.status(200).render('landing', { KEY: KEY });
    } catch (err) {
        console.log('Broken.. /index GET');
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