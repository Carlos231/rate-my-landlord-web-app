const express = require('express');

const router = express.Router();

const {
    getLandlordsByPage,
    getLandlordById,
    deleteLandlord,
    addLandlord,
    updateLandlord,
} = require('../models/landlord');
const { getComments } = require('../models/comment');

const isLoggedIn = require('../utils/isLoggedIn');
const checkLandlordOwner = require('../utils/checkLandlordOwner');

// Config Import
const KEY = process.env.MAPSAPI;

// index - get everything
router.get('/', async (req, res) => {
    // console.log(req.user);
    const perPage = 2;
    const page = 1;

    try {
        const [landlords, count] = await getLandlordsByPage(page, perPage);
        const comments = await getComments();
        res.status(200).render('landlords', {
            landlords,
            comments,
            current: page,
            pages: Math.ceil(count / perPage),
        });
    } catch (err) {
        console.log('Broken.. /landlords/ GET', err);
        req.flash('error', 'Error fetching landlords');
        res.status(500).redirect('/');
    }
});

// get index pages
router.get('/pages/:page', async (req, res) => {
    // console.log(req.user);
    const perPage = 2;
    const page = req.params.page || 1;

    try {
        const [landlords, count] = await getLandlordsByPage(page, perPage);
        const comments = await getComments();
        // pass in the user
        // console.log("Pages:" + Math.ceil(count / perPage))
        res.status(200).render('landlords', {
            landlords,
            comments,
            current: page,
            pages: Math.ceil(count / perPage),
        });
    } catch (err) {
        console.log('Broken.. /landlords/ GET', err);
        req.flash('error', 'Error fetching landlords');
        res.status(500).redirect('/');
    }
});

// Create - add new landlord
router.post('/', isLoggedIn, async (req, res) => {
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
        isOwner: !!req.body.owner,
        img: req.body.img,
        img_description: req.body.img_description,
        owner: {
            id: req.user._id,
            username: req.user.username,
        },
        // or can do this ->
        // ...req.body
    };

    try {
        // redirect to new landlord created
        const landlord = await addLandlord(newLandlord);
        // console.log(landlord);
        req.flash('success', 'Landlord created!');
        res.status(201).redirect(`/landlords/${landlord._id}`);
    } catch (err) {
        console.log('Broken.. /landlords/index POST', err);
        req.flash('error', 'Error creating landlord');
        res.status(400).redirect('/landlords');
    }
});

// New
router.get('/new', isLoggedIn, (req, res, next) => {
    try {
        res.status(200).render('landlords_new', { KEY });
    } catch (err) {
        console.log('Broken... /landlords/new', err);
        next();
    }
});

// Search
router.get('/search', async (req, res) => {
    try {
        const perPage = 1;
        const page = req.params.page || 1;

        // has to be indexed for this to work on search
        // will only search text fields
        // get all comments matching the query
        const [landlords, count] = await getLandlordsByPage(page, perPage, {
            $text: {
                $search: req.query.term,
            },
        });

        const comments = await getComments();
        res.status(200).render('landlords', {
            landlords,
            comments,
            current: page,
            pages: Math.ceil(count / perPage),
        });
    } catch (err) {
        console.log('Broken /search GET', err);
        res.status(400).redirect('/landlords');
    }
});

// Landlord Types
router.get('/type/:type', async (req, res, next) => {
    // check if type is valid
    const validTypes = ['apartments', 'houses', 'rooms']; // if bigger application would pull this from a config file to edit easier
    if (validTypes.includes(req.params.type.toLocaleLowerCase())) {
        const perPage = 4;
        const page = 1;

        // eslint-disable-next-line max-len
        const [landlords, count] = await getLandlordsByPage(page, perPage, { type: req.params.type });
        const comments = await getComments();
        res.status(200).render('landlords', {
            landlords,
            comments,
            type: req.params.type,
            current: page,
            pages: Math.ceil(count / perPage),
        });
    } else {
        console.log('Broken.. /landlords/type GET Invalid type.');
        next();
    }
});

// Show
router.get('/:id', async (req, res, next) => {
    try {
        // get all landlords
        const landlord = await getLandlordById(req.params.id);
        // get all comments associated with landlord
        // queries on mongoose
        const comments = await getComments({
            landlordId: req.params.id,
        });
        // render page with landlord and comments
        res.status(200).render('landlords_show', {
            landlord,
            comments,
        });
    } catch (err) {
        console.log('You broke it... /landlords/:id', err);
        next();
    }
});

// Edit
router.get('/:id/edit', checkLandlordOwner, async (req, res) => {
    try {
        // get all comments
        const landlord = await getLandlordById(req.params.id);
        // if owner, render the form to edit
        res.status(200).render('landlords_edit', {
            landlord,
        });
    } catch (error) {
        console.log('You broke it.. /landlords/:id/edit EDIT');
        res.status(400).redirect(`/landlords/${req.params.id}`);
    }
});

// Update
router.put('/:id', checkLandlordOwner, async (req, res) => {
    // borrow this from post
    const type = req.body.type.toLowerCase();
    const landlordBody = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        business: req.body.business,
        type,
        isOwner: !!req.body.owner,
        img: req.body.img,
        img_description: req.body.img_description,
        owner: {
            id: req.user._id,
            username: req.user.username,
        },
    };

    try {
        await updateLandlord(req.params.id, landlordBody);
        req.flash('success', 'Landlord updated!');
        res.status(200).redirect(`/landlords/${req.params.id}`);
    } catch (err) {
        console.log('You broke it... /landlords/:id PUT', err);
        req.flash('error', 'Error updating Landlord!');
        res.status(400).redirect('/landlords');
    }
});

// Delete
router.delete('/:id', checkLandlordOwner, async (req, res) => {
    try {
        deleteLandlord(req.params.id);
        req.flash('success', 'Landlord deleted!');
        res.status(200).redirect('/landlords');
    } catch (err) {
        console.log('You broke it... /landlords/:id DELETE', err);
        req.flash('error', 'Error deleting landlord!');
        req.status(500).redirect('/landlords');
    }
});

module.exports = router;
