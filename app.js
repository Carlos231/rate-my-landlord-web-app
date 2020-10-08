// =======================
// IMPORTS
// =======================
// NPM Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

// Config Import
try {
    var config = require('./config');
} catch (error) {
    console.log("Could not import config. Not working locally");
    console.log(error);
}

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
try {
    // if working locally
    mongoose.connect(config.db.connection, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
} catch (error) {
    // for deployment
    console.log("Could not connect using config. Not working locally.");
    mongoose.connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
}


// Express Config
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Express Session Config
app.use(expressSession({
    secret: process.env.ES_SECRET || config.expressSession.secret,
    resave: false,
    saveUninitialized: false
}));

// Method Override Config
app.use(methodOverride('_method'));

// Passport Config
app.use(passport.initialize());
app.use(passport.session()); // Allow persistent sessions
passport.serializeUser(User.serializeUser()); // What data should be stored in session
passport.deserializeUser(User.deserializeUser()); // Get user data from the stored session
passport.use(new LocalStrategy(User.authenticate())); // Use the local strategy


// no longer need this when plugged into db
// const landLords = [{
//         name: 'Kobe Bryant',
//         phone: 5037998122,
//         email: 'kobe@kobeapartments.com',
//         business: 'Kobe Apartments',
//         img: 'https://images.squarespace-cdn.com/content/5ecdab0a27eb1f230be656e6/1597183147422-BRKWMN6XPEMZZ1O8VGZY/01-Standard%2BApartments-018.jpg?format=1500w&content-type=image%2Fjpeg',
//         img_description: 'Butterfly on flower',
//         reviews: [{
//                 name: 'Bill',
//                 content: 'He took all my money'
//             },
//             {
//                 name: 'Ron',
//                 content: 'Dont waste your time'
//             },
//             {
//                 name: 'Jane',
//                 content: 'Idk'
//             }
//         ]
//     },
//     {
//         name: 'Emily Cover',
//         phone: 5038005123,
//         email: 'Emily@allapartments.com',
//         business: 'All Apartments',
//         img: 'https://redpeak.com/app/uploads/2020/04/777-Ash-Denver-Apartments-450x0-c-default.jpg',
//         img_description: 'Picture of Blue Lakes',
//         reviews: [{
//                 name: 'john',
//                 content: 'Shes hot'
//             },
//             {
//                 name: 'Ruby',
//                 content: 'Run away'
//             },
//             {
//                 name: 'Chip',
//                 content: 'Good landlord'
//             }
//         ]
//     }
// ];

// Current User Middleware Config
app.use((req, res, next) => {
    // value on response object we can add key value pairs to
    // will make it available to all routes
    res.locals.user = req.user;
    next();
})

// Route Config
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/landlords', landlordRoutes);
app.use('/landlords/:id/comments', commentRoutes);
// app.use('/reviews', reviewRoutes);

// =======================
// LISTEN
// =======================
app.listen(PORT, () => {
    console.log(`rate_my_landlord is running on PORT: ${PORT}...`);
})