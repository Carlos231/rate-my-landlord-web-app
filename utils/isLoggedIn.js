// refactor to arrow function
const isLoggedIn = (req, res, next) => {
    // function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
        // else not needed since return but great readabilty with it
    } else {
        //          type, message
        req.flash("error", "Hey! You must be logged in to do that!");
        res.redirect('/login')
    }
};

module.exports = isLoggedIn;