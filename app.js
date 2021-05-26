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
const rateLimit = require('express-rate-limit');

// Config Import
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Route Imports
const indexRoutes = require('./routes/index');
const landlordRoutes = require('./routes/landlords');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');
// const reviewRoutes = require('./routes/reviews');

// Model Imports
const Landlord = require('./models/landlord');
const Comment = require('./models/comment');
const { User, createNewUser } = require('./models/user');

// =======================
// DEVELOPMENT
// =======================
// app.use(morgan('tiny'));
//  Seed the DB
// const seed = require('./utils/seedDB');
// seed();

// =======================
// CONFIG
// =======================
// Body Parser Config
app.use(bodyParser.urlencoded({
    extended: true,
}));

// Mongoose Config Connect to DB
try {
    mongoose.connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    });
} catch (error) {
    console.log('Could not connect to DB');
    console.log(error);
}

// Prevent people from spamming the API
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 30, // limit each IP to 30 requests per windowMs
    message:
        'You have reached your allowed requests for this IP, please try again after an hour',
});

app.use(limiter);

// Express Config
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Express Session Config
app.use(expressSession({
    secret: process.env.ES_SECRET,
    resave: false,
    saveUninitialized: false,
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
    res.locals.errorMessage = req.flash('error');
    res.locals.successMessage = req.flash('success');
    next();
});

// Route Config
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/accounts', accountRoutes);
app.use('/landlords', landlordRoutes);
app.use('/landlords/:id/comments', commentRoutes);
// app.use('/reviews', reviewRoutes);

// Error page
app.use('*', (req, res) => {
    res.status(404).render('error', { error: `Requested resource ${req.originalUrl} does not exist` });
});

// =======================
// LISTEN
// =======================
const server = app.listen(PORT, () => {
    console.log(`== rate_my_landlord is running on PORT: ${PORT}...`);
});

// Export our app for testing purposes
module.exports = server;
