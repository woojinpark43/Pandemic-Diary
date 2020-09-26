/* Tweets mongoose model */
const mongoose = require("mongoose");

const ShareableSchema = new mongoose.Schema({
    content: {
        type: String,
        unique: false,
    },
    image_id: {
        type: String,
        unique: false,
    },
    image_url: {
        type: String,
        unique: false,
    },
    date: {
        type: Date,
    },
    center: {
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        },
    },
    type: {
        type: String,
    },
    article: {
        type: String,
    },
    user: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Store ID, not username
        ref: 'User'
    }
});

ShareableSchema.statics.findByDate = function (date) {
    const Set = this;

    const start = new Date(new Date(date).toDateString());
    const end = new Date(start.toDateString());
    end.setTime(start.getTime() + 86400000);

    return Set.find({
        date: {
            $gte: start,
            $lt: end,
        },
    });
};

// make a model using the Shareable schema
const Shareable = mongoose.model("Shareable", ShareableSchema);

module.exports = { Shareable };
