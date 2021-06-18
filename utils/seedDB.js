const Landlord = require('../models/landlord');
const Comment = require('../models/comment');

const landlord_seeds = [{
    name: 'Kobe Bryant',
    phone: 5037998122,
    email: 'kobe@kobeapartments.com',
    business: 'Kobe Apartments',
    type: 'apartments',
    owner: true,
    img: 'https://images.squarespace-cdn.com/content/5ecdab0a27eb1f230be656e6/1597183147422-BRKWMN6XPEMZZ1O8VGZY/01-Standard%2BApartments-018.jpg?format=1500w&content-type=image%2Fjpeg',
    img_description: 'Butterfly on flower',
    reviews: [{
        name: 'Bill',
        content: 'He took all my money',
    },
    {
        name: 'Ron',
        content: 'Dont waste your time',
    },
    {
        name: 'Jane',
        content: 'Idk',
    },
    ],
},
{
    name: 'Emily Cover',
    phone: 5038005123,
    email: 'Emily@allapartments.com',
    business: 'All Apartments',
    type: 'apartments',
    owner: false,
    img: 'https://redpeak.com/app/uploads/2020/04/777-Ash-Denver-Apartments-450x0-c-default.jpg',
    img_description: 'Picture of Blue Lakes',
    reviews: [{
        name: 'john',
        content: 'Shes hot',
    },
    {
        name: 'Ruby',
        content: 'Run away',
    },
    {
        name: 'Chip',
        content: 'Good landlord',
    },
    ],
},
{
    name: 'Billy Idol',
    phone: 5031115123,
    email: 'Billt@allapartments.com',
    business: 'Idol Lcc.',
    type: 'rooms',
    owner: true,
    img: 'https://redpeak.com/app/uploads/2020/04/777-Ash-Denver-Apartments-450x0-c-default.jpg',
    img_description: 'Picture of Blue Lakes',
    reviews: [{
        name: 'john',
        content: 'No bathroom',
    },
    {
        name: 'Ruby',
        content: 'Annoying',
    },
    {
        name: 'Chip',
        content: 'Bad landlord',
    },
    ],
},
];

const seed = async () => {
    // Delete current landlords and comments
    // can pass filter params to only delete certain things
    await Landlord.deleteMany();
    console.log('Deleted All of the Landlords');
    await Comment.deleteMany();
    console.log('Deleted All of the Comments');

    // Create three new landlords
    // like a for each but able to use the async here and not in for each(have to do another function for for each)
    // for (const landlord_seed of landlord_seeds) {
    //     // do something
    //     //finsihes first
    //     let landlord = await Landlord.create(landlord_seed);
    //     console.log("Created a new Landlord:", landlord.name);
    //     // then this runs

    //     // Create a new comment for each landlord
    //     await Comment.create({
    //         text: "Something funny",
    //         user: "scooby_doo",
    //         landlordID: landlord._id
    //     })
    //     console.log("Created a Comment");

    // }
};

module.exports = seed;
