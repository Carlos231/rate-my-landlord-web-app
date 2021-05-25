const express = require('express');
const router = express.Router();
const passport = require('passport');
const { createNewUser } = require('../models/user');

// Sign up - New
router.get('/signup', (req, res) => {
    try {
        res.status(200).render('signup');
    } catch (err) {
        next(err);
    }
})

// Sign up - Create
router.post('/signup', async (req, res) => {
    try {
        const newUser = await createNewUser(req.body.username, req.body.email, req.body.password);
        // console.log("New user:", newUser.username);

        req.flash("success", `Signed you up as "${newUser.username}"`);
        passport.authenticate('local')(req, res, () => {
            res.status(201).redirect('/landlords');
        });
    } catch (err) {
        // console.log("Broken.. /signup POST", err.message);
        req.flash("error", `Error signing you up as "${req.body.username}". ${err.message}.`);
        res.status(400).redirect('/signup');
    }
});

// Login - show form
router.get('/login', (req, res) => {
    try {
        res.status(200).render('login');
    } catch (error) {
        next(err);
    }
});

// Login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: "Logged in successfully!"
}));

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash("success", "You are logged out now.");
    res.status(200).redirect('/landlords');
});

module.exports = router;