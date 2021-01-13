const mongoose = require('mongoose');
const validator = require('validator');

const watchListSchema = new mongoose.Schema({
    movieID: {
        type: Number,
        required: true,
        trim: true
    },
    poster: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const WatchList = mongoose.model('WatchList', watchListSchema);

module.exports = WatchList