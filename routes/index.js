const express = require('express');
const router = express.Router();

const isLoggedIn = require('../utils/isLoggedIn');

// index
router.get("/", (req, res) => {
    res.render('landing');
});

router.get("/account", isLoggedIn, (req, res) => {
    res.render('account');
})

module.exports = router;