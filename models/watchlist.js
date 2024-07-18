const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const watchlistSchema = mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    list:{
        type:[String],
        required:true
    }
})

const Watchlist = mongoose.model('Watchlist',watchlistSchema);
module.exports = Watchlist;