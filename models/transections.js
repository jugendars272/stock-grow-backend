const mongoose = require('mongoose');
const transectionSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description:{
        type: String,
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
    }
 });


const Transection = mongoose.model('Transection',transectionSchema);

module.exports = Transection
