const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        trim: true,
        maxlength: 100,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
    }
},
{ timestamps: true}
);

// only one review per user-product
ReviewSchema.index({product: 1, user: 1}, {unique: true});

module.exports = mongoose.model('Review', ReviewSchema);