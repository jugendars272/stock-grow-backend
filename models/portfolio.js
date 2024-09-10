// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const portfolioSchema = new mongoose.Schema({
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     ticker: {
//         type: String,
//         required: true
//     },
//     quantity: {
//         type: Number,
//         required: true
//     },
//     averagePrice: {
//         type: Number,
//         required: true
//     }
// });

// const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// module.exports = Portfolio;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ticker: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    averagePrice: {
        type: Number,
        required: true
    },
    positionType: {
        type: String,
        enum: ['long', 'short'],
        required: true
    }
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
