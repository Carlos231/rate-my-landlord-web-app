const express = require('express');

const router = express.Router();

const Landlord = require('../models/landlord');

// add reviews
router.post('/addReview', (req, res) => {
    console.log(req.body);
    landLords[0].reviews.push(req.body);
    // landLords
    res.redirect('/landlords');
});

router.get('/landlords/addReview', (req, res) => {
    res.render('addReview');
});

module.export = router;
