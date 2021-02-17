const express = require('express');
const router = express.Router();

const User = require('../models/user');

const isLoggedIn = require('../utils/isLoggedIn');

// Show account info
router.get("/:id", isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).exec();
        res.status(200).render("account", { user });
    } catch (err) {
        console.log('You broke it... /account/:id', err);
        next();
    }
});

// Delete users account
router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id).exec();
        req.flash("success", "User deleted!");
        res.status(200).redirect("/landlords");
    } catch (err) {
        console.log('You broke it... /accounts/:id DELETE', err);
        req.flash("error", "Error deleting user!");
        req.status(500).redirect("/landlords");
    }
})

module.exports = router;