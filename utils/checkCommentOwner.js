const { getCommetsById } = require('../models/comment');

const checkCommentOwner = async (req, res, next) => {
    if (req.isAuthenticated()) { // check if the user is logged in
        // get all comments
        const comment = await getCommetsById(req.params.commentId);
        // check if both of these match
        // console.log(comment.owner.id);
        // console.log(req.user._id);
        if (comment.user.id.equals(req.user._id)) { // if owner
            // do the next thing - continue
            next();
        } else { // if not redirect to the show page
            req.flash('error', "You don't have permission to do that!");
            // back path given by express - will redirect/go back a page
            res.redirect('back');
        }
    } else { // if not logged in redirect to the login
        req.flash('error', 'You must be logged in to do that!');
        res.redirect('/login');
    }
};

module.exports = checkCommentOwner;
