const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statesSchema = new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    current:{
        type: Number,
        required: true,
        default: 0
    },
    invested:{
        type: Number,
        required: true,
        default: 0
    },
    returns:{
        type: Number,
        required: true,
        default: 0
    },
    totalReturnsPerc:{
        type: Number,
        required: true,
        default: 0
    }
});

const States = mongoose.model('states', statesSchema);

module.exports = States;