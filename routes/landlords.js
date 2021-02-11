const express = require('express');
const router = express.Router();

const Landlord = require('../models/landlord');
const Comment = require('../models/comment');

const isLoggedIn = require('../utils/isLoggedIn');
const checkLandlordOwner = require('../utils/checkLandlordOwner');

let KEY;

// Config Import
KEY = process.env.MAPSAPI;

// index - get everything
router.get("/", async (req, res) => {
    // console.log(req.user);
    try {
        const landlords = await Landlord.find().exec();
        const comments = await Comment.find().exec();
        // pass in the user
        res.status(200).render('landlords', {
            landlords,
            comments
        });
    } catch (err) {
        console.log('Broken.. /landlords/ GET', err);
        req.flash('error', 'Error fetching landlords');
        res.status(500).redirect('/');
    }
})

// Create - add new landlord
router.post("/", isLoggedIn, async (req, res) => {
    // console.log(req.body);

    const type = req.body.type.toLowerCase();

    const newLandlord = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        business: req.body.business,
        type,
        // negate - first one is string, flip it to false, then flip again for true
        owner: !!req.body.owner,
        img: req.body.img,
        img_description: req.body.img_description,
        owner: {
            id: req.user._id,
            username: req.user.username
        }
        // or can do this ->
        // ...req.body
    }

    try {
        // redirect to new landlord created
        const landlord = await Landlord.create(newLandlord);
        // console.log(landlord);
        req.flash("success", "Landlord created!");
        res.status(201).redirect(`/landlords/${landlord._id}`);
    } catch (err) {
        console.log('Broken.. /landlords/index POST', err);
        req.flash("error", "Error creating landlord");
        res.status(400).redirect("/landlords");
    }
})

// New
router.get("/new", isLoggedIn, (req, res, next) => {
    try {
        res.status(200).render("landlords_new", { KEY: KEY });
    } catch (err) {
        console.log('Broken... /landlords/new', err);
        next();
    }
})

// Search
router.get("/search", async (req, res) => {
    try {
        // has to be indexed for this to work on search
        // will only search text fields
        // get all comments matching the query
        const landlords = await Landlord.find({
            $text: {
                $search: req.query.term
            }
        });
        const comments = await Comment.find().exec();
        res.status(200).render("landlords", {
            landlords, comments
        });
    } catch (err) {
        console.log('Broken /search GET', err);
        res.status(400).redirect("/landlords");
    }
})

// Landlord Types
router.get("/type/:type", async (req, res, next) => {
    // check if type is valid
    const validTypes = ["apartments", "houses", "rooms"]; // if bigger application would pull this from a config file to edit easier
    if (validTypes.includes(req.params.type.toLocaleLowerCase())) {
        const landlords = await Landlord.find({ type: req.params.type }).exec();
        const comments = await Comment.find().exec();
        res.status(200).render("landlords", { landlords, comments });
    } else {
        console.log('Broken.. /landlords/type GET Invalid type.');
        next();
    }
})

// Show 
router.get("/:id", async (req, res, next) => {
    try {
        // get all landlords
        const landlord = await Landlord.findById(req.params.id).exec();
        // get all comments associated with landlord
        // queries on mongoose
        const comments = await Comment.find({
            landlordId: req.params.id
        });
        // render page with landlord and comments
        res.status(200).render("landlords_show", {
            landlord,
            comments
        });
    } catch (err) {
        console.log('You broke it... /landlords/:id', err);
        next();
    }
})

// Edit
router.get("/:id/edit", checkLandlordOwner, async (req, res) => {
    try {
        // get all comments
        const landlord = await Landlord.findById(req.params.id).exec();
        // if owner, render the form to edit
        res.status(200).render("landlords_edit", {
            landlord
        });
    } catch (error) {
        console.log('You broke it.. /landlords/:id/edit EDIT');
        res.status(400).redirect(`/landlords/${req.params.id}`);
    }
})

// Update
router.put("/:id", checkLandlordOwner, async (req, res) => {
    // borrow this from post
    const type = req.body.type.toLowerCase();
    const landlordBody = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        business: req.body.business,
        type,
        owner: !!req.body.owner,
        img: req.body.img,
        img_description: req.body.img_description
    }

    try {
        const landlord = await Landlord.findByIdAndUpdate(req.params.id, landlordBody, {
            // see object after is updates (3rd param)
            new: true
        }).exec();
        req.flash("success", "Landlord updated!");
        res.status(200).redirect(`/landlords/${req.params.id}`);
    } catch (err) {
        console.log('You broke it... /landlords/:id PUT', err);
        req.flash("error", "Error updating Landlord!");
        res.status(400).redirect("/landlords");
    }
})

// Delete
router.delete("/:id", checkLandlordOwner, async (req, res) => {
    try {
        const deletedLandlord = await Landlord.findByIdAndDelete(req.params.id).exec();
        req.flash("success", "Landlord deleted!");
        res.status(200).redirect("/landlords");
    } catch (err) {
        console.log('You broke it... /landlords/:id DELETE', err);
        req.flash("error", "Error deleting landlord!");
        req.status(500).redirect("/landlords");
    }
})

module.exports = router;