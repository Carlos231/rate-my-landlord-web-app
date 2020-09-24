// refactor to arrow function
const isLoggedIn = (req, res, next) => {
    // function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
        // else not needed since return but great readabilty with it
    } else {
        res.redirect('/login')
    }
};

module.exports = isLoggedIn;