const express = require('express');
const router = express.Router();

const Landlord = require('../models/landlord');
const Comment = require('../models/comment');

// index - get everything
router.get("/", async (req, res) => {
    try {
        const landlords = Landlord.find().exec()
        res.render('landlords', {
            landlords: foundLandlords
        });
    } catch (err) {
        console.log(err);
        res.send("you broke it... /index");
    }
})

// Create - add new landlord
router.post("/", (req, res) => {
    console.log(req.body);

    // only doing it like this to be fast but should be checking the values before pluggin them in
    // landLords.push(req.body);
    // res.redirect("/landlords");

    const type = req.body.type.toLowerCase();

    const newLandlord = {
        // title: req.body.title, 
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        business: req.body.business,
        type,
        // negate - first one is string, flip it to false, then flip again for true
        owner: !!req.body.owner,
        img: req.body.img,
        img_description: req.body.img_description
        // or can do this ->
        // ...req.body
    }

    // redirect to new landlord created
    Landlord.create(newLandlord)
        .then((landlord) => {
            console.log(landlord);
            res.redirect("/landlords/" + landlord._id);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

})

// New
router.get("/new", (req, res) => {
    res.render("landlords_new");
})

// Show
router.get("/:id", (req, res) => {
    // res.send("Show page for comic with ID of: " + req.params.id);
    // get all comments
    Landlord.findById(req.params.id)
        .exec()
        // get all comments associated with landlord
        .then((landlord) => {
            // find comments
            Comment.find({
                // queries on mongoose
                landlordID: req.params.id
            }, (err, comments) => {
                if (err) {
                    res.send(err);
                } else {
                    // render page with landlord and comments
                    res.render("landlords_show", {
                        landlord,
                        comments
                    })
                }
            })
        })
        .catch((err) => {
            res.send(err)
        })
})

// Edit
router.get("/:id/edit", (req, res) => {
    // get data from db
    Landlord.findById(req.params.id)
        .exec()
        // render edit form, passing in that comic
        .then((landlord) => {
            res.render("landlords_edit", {
                landlord
            });
        })

})

// Update
router.put("/:id", (req, res) => {
    // borrow this from post
    const type = req.body.type.toLowerCase();
    const updatedLandlord = {
        // title: req.body.title, 
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        business: req.body.business,
        type,
        owner: !!req.body.owner,
        img: req.body.img,
        img_description: req.body.img_description
    }

    Landlord.findByIdAndUpdate(req.params.id, updatedLandlord, {
            // see object after is updates (3rd param)
            new: true
        })
        .exec()
        .then((updatedLandlord) => {
            console.log(updatedLandlord);
            res.redirect(`/landlords/${req.params.id}`);
        })
        .catch((err) => {
            res.send("Error:", err);
        })
})

// Delete
router.delete("/:id", (req, res) => {
    Landlord.findByIdAndDelete(req.params.id)
        .exec()
        .then((deletedLandlord) => {
            console.log("Deleted:", deletedLandlord);
            res.redirect("/landlords");
        })
        .catch((err) => {
            res.send("Errord deleting:", err);
        })
})

module.exports = router;