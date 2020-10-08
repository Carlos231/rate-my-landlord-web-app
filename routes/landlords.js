const express = require('express');
const router = express.Router();

const Landlord = require('../models/landlord');
const Comment = require('../models/comment');

const isLoggedIn = require('../utils/isLoggedIn');
const checkLandlordOwner = require('../utils/checkLandlordOwner');

// index - get everything
router.get("/", async (req, res) => {
    // console.log(req.user);
    try {
        const landlords = await Landlord.find().exec();
        // pass in the user
        res.render('landlords', {
            landlords: landlords
        });
    } catch (err) {
        console.log(err);
        res.send("you broke it... /landlords/index");
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
        res.redirect("/landlords/" + landlord._id);
    } catch (err) {
        console.log(err);
        req.flash("error", "Error creating landlord");
        // res.send("you broke it... /landlords/index POST");
        res.redirect("/landlords");
    }
})

// New
router.get("/new", isLoggedIn, (req, res) => {
    try {
        res.render("landlords_new");
    } catch (error) {
        console.log(err);
        res.send("Broken... /landlords/new");
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
        res.render("landlords", {
            landlords
        });
    } catch (err) {
        console.log(err);
        res.send("Broken /search GET");
    }
})

// Landlord Types
router.get("/type/:type", async (req, res) => {
    // check if type is valid
    const validTypes = ["apartments", "houses", "rooms"]; // if bigger application would pull this from a config file to edit easier
    if (validTypes.includes(req.params.type.toLocaleLowerCase())) {
        const landlords = await Landlord.find({ type: req.params.type }).exec();
        res.render("landlords", { landlords });
    } else {
        res.send("Please enter a valid type.");
    }
})

// Show 
router.get("/:id", async (req, res) => {
    try {
        // get all comments
        const landlord = await Landlord.findById(req.params.id).exec();
        // get all comments associated with landlord
        // queries on mongoose
        const comments = await Comment.find({
            landlordId: req.params.id
        });
        // render page with landlord and comments
        res.render("landlords_show", {
            landlord,
            comments
        });
    } catch (err) {
        console.log(err);
        res.send("You broke it... /landlords/:id");
    }
})

// Edit
router.get("/:id/edit", checkLandlordOwner, async (req, res) => {
    // get all comments
    const landlord = await Landlord.findById(req.params.id).exec();
    // if owner, render the form to edit
    res.render("landlords_edit", {
        landlord
    });
})

// Edit authentication before refactoring with middleware function
// router.get("/:id/edit", checkLandlordOwner, async (req, res) => {
//     if (req.isAuthenticated()) { // check if the user is logged in
//         // get all comments
//         const landlord = await Landlord.findById(req.params.id).exec();
//         // check if both of these match
//         console.log(landlord.owner.id);
//         console.log(req.user._id);
//         if (landlord.owner.id.equals(req.user._id)) {
//             // if owner, render the form to edit
//             res.render("landlords_edit", {
//                 landlord
//             });
//         } else { // if not redirect to the show page
//             res.redirect(`/landlords/${landlord._id}`);
//         }
//     } else { // if not logged in redirect to the login
//         res.redirect("/login");
//     }
// })

// Edit - before authentication
// router.get("/:id/edit", isLoggedIn, async (req, res) => {
//     try {
//         // get data from db
//         const landlord = await Landlord.findById(req.params.id).exec();
//         // render edit form, passing in that comic
//         res.render("landlords_edit", {
//             landlord
//         });
//     } catch (err) {
//         console.log(err);
//         res.send("You broke it... /landlords/:id/edit");
//     }
// })

// Update
router.put("/:id", checkLandlordOwner, async (req, res) => {
    // borrow this from post
    const type = req.body.type.toLowerCase();
    const landlordBody = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
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
        res.redirect(`/landlords/${req.params.id}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Error updating Landlord!");
        // res.send("You broke it... /landlords/:id PUT");
        res.redirect("/landlords");

    }

})

// Delete
router.delete("/:id", checkLandlordOwner, async (req, res) => {
    try {
        const deletedLandlord = await Landlord.findByIdAndDelete(req.params.id).exec();
        req.flash("success", "Landlord deleted!");
        res.redirect("/landlords");
    } catch (err) {
        console.log(err);
        req.flash("error", "Error deleting landlord!");
        // res.send("You broke it... /landlords/:id DELETE");
        req.redirect("back");
    }
})

module.exports = router;