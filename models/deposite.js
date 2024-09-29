const mongoose = require('mongoose');

const depositeSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    transactionId:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        default: 'pending'
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const Deposit = mongoose.model('Deposit', depositeSchema);

module.exports = Deposit;