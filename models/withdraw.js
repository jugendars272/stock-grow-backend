const mongoose = require('mongoose');
const withdrawSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        required: true,
        default: Date.now
    },
    upiId:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        default: 'pending'
    } 
})

const Withdraw = mongoose.model('Withdraw', withdrawSchema);

module.exports = Withdraw;