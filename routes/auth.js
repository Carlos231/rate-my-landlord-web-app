const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Sign up - New
router.get('/signup', (req, res) => {
    res.render('signup');
})

// Sign up - Create
router.post('/signup', async (req, res) => {
    try {
        const newUser = await User.register(new User({
            username: req.body.username,
            email: req.body.email
        }), req.body.password);
        console.log("New user:", newUser);
        passport.authenticate('local')(req, res, () => {
            res.redirect('/landlords');
        });
    } catch (err) {
        console.log(err);
        res.send("Broken... /signup POST");
    }
});

// Login - show form
router.get('/login', (req, res) => {
    res.render('login');
});

// Login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/landlords',
    failureRedirect: '/login'
}));

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/landlords');
});


module.exports = router;