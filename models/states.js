// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const statesSchema = new mongoose.Schema({
//     userId:{
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     current:{
//         type: Number,
//         required: true,
//         default: 0
//     },
//     invested:{
//         type: Number,
//         required: true,
//         default: 0
//     },
//     returns:{
//         type: Number,
//         required: true,
//         default: 0
//     },
//     totalReturnsPerc:{
//         type: Number,
//         required: true,
//         default: 0
//     }
// });

// const States = mongoose.model('states', statesSchema);

// module.exports = States;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statesSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    current: {
        type: Number,
        default: 0 // Available cash balance
    },
    invested: {
        type: Number,
        default: 0 // Total invested amount
    },
    returns: {
        type: Number,
        default: 0 // Profit or loss
    },
    totalReturnsPerc: {
        type: Number,
        default: 0 // Percentage returns
    },
    margin: {
        type: Number,
        default: 0 // Margin held for short positions
    }
});

const States = mongoose.model('States', statesSchema);

module.exports = States;
