const Landlord = require('../models/landlord')

const checkLandlordOwner = async (req, res, next) => {
    if (req.isAuthenticated()) { // check if the user is logged in
        // get all comments
        const landlord = await Landlord.findById(req.params.id).exec();
        // check if both of these match
        // console.log(landlord.owner.id);
        // console.log(req.user._id);
        if (landlord.owner.id.equals(req.user._id)) { //if owner
            // do the next thing - continue
            next();
        } else { // if not redirect to the show page
            // back path given by express - will redirect/go back a page
            res.redirect("back");
        }
    } else { // if not logged in redirect to the login
        res.redirect("/login");
    }
}

module.exports = checkLandlordOwner;