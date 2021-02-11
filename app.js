// =======================
// IMPORTS
// =======================
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

// Config Import
require('dotenv').config();

// try {
//     var config = require('./config');
// } catch (error) {
//     console.log("Could not import config. Not working locally");
//     console.log(error);
// }

const PORT = process.env.PORT || 3000;

// Route Imports
const indexRoutes = require('./routes/index');
const landlordRoutes = require('./routes/landlords');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth')
// const reviewRoutes = require('./routes/reviews');

// Model Imports
const Landlord = require('./models/landlord');
const Comment = require('./models/comment');
const User = require('./models/user');

// =======================
// DEVELOPMENT
// =======================
app.use(morgan('tiny'));
//  Seed the DB
// const seed = require('./utils/seedDB');
// seed();

// =======================
// CONFIG
// =======================
// Body Parser Config
app.use(bodyParser.urlencoded({
    extended: true
}));

// Mongoose Config Connect to DB

// for deployment
console.log("Could not connect using config. Not working locally.");
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

// Express Config
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Express Session Config
app.use(expressSession({
    secret: process.env.ES_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Method Override Config
app.use(methodOverride('_method'));

// Connect flash
app.use(flash());

// Passport Config
app.use(passport.initialize());
app.use(passport.session()); // Allow persistent sessions
passport.serializeUser(User.serializeUser()); // What data should be stored in session
passport.deserializeUser(User.deserializeUser()); // Get user data from the stored session
passport.use(new LocalStrategy(User.authenticate())); // Use the local strategy

// State Config
app.use((req, res, next) => {
    // value on response object we can add key value pairs to
    // will make it available to all routes
    res.locals.user = req.user;
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    next();
})

// Route Config
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/landlords', landlordRoutes);
app.use('/landlords/:id/comments', commentRoutes);
// app.use('/reviews', reviewRoutes);

// Error page
app.use('*', function (req, res, next) {
    res.status(404).render('error', { 'error': "Requested resource " + req.originalUrl + " does not exist" });
});

// =======================
// LISTEN
// =======================
app.listen(PORT, () => {
    console.log(`== rate_my_landlord is running on PORT: ${PORT}...`);
})