const express = require('express');
const router = express.Router({
    mergeParams: true
});

const Comment = require("../models/comment");

const isLoggedIn = require('../utils/isLoggedIn');
const checkCommentOwner = require('../utils/checkCommentOwner');

// new comments form
// add comments nested
router.get("/new", isLoggedIn, (req, res) => {
    try {
        res.render("comments_new", {
            landlordId: req.params.id
        })
    } catch (err) {
        console.log(err);
        res.send("Broken... /comments/new GET");
    }
})

// create comment and update in DB
router.post("/", isLoggedIn, async (req, res) => {
    try {
        const newComment = await Comment.create({
            // add in the form data the object 
            // ej6 way
            // ...req.body
            user: {
                id: req.user._id,
                username: req.user.username
            },
            text: req.body.text,
            landlordId: req.body.landlordId
        });
        // console.log(newComment);
        req.flash("success", "Comment created!");
        res.redirect(`/landlords/${req.body.landlordId}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Error creating comment!");
        // res.send("You broke it... /landlords/:id/comments POST")
        req.redirect("/landlords");
    }
})

// EDIT
router.get("/:commentId/edit", checkCommentOwner, async (req, res) => {
    try {
        // const landlord = await Landlord.findById(req.params.id).exec();
        const comment = await Comment.findById(req.params.commentId).exec();
        // avoid qurerying twice:
        res.render("comments_edit", {
            // landlord,
            landlord_id: req.params.id,
            comment
        });
    } catch (err) {
        console.log(err);
        // res.send("Broken... /comments EDIT");
    }
})

// UPDATE
router.put("/:commentId", checkCommentOwner, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.commentId, {
            text: req.body.text
        }, {
            new: true
        });
        req.flash("success", "Comment edited!");
        res.redirect(`/landlords/${req.params.id}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Error editing comment!");
        // res.send("Broken... /comments UPDATE");
        res.redirect("/landlords");

    }
})

// DELETE
router.delete("/:commentId", checkCommentOwner, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.commentId);
        req.flash("success", "Comment deleted!");
        res.redirect(`/landlords/${req.params.id}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Error deleting comment!");
        // res.send("Broken.. /comments DELETE");
        res.redirect("/landlords");
    }
})

module.exports = router;