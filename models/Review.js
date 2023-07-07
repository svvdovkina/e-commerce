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

ReviewSchema.statics.calculateAverageRating = async function(productId) {
    const result = await this.aggregate([
        {$match: {product: productId}},
        {$group: {
            _id: null,
            averageRating : {$avg: '$rating'},
            numOfReviews: {$sum: 1}
        }}
    ]);
    try {
        await this.model('Product').findByIdAndUpdate(productId, {
            averageRating: Math.round(result[0]?.averageRating || 0),
            numOfReviews: result[0]?.numOfReviews || 0
        })
    } catch (err) {
        console.log(err);
    }
    console.log('static', result);
}


ReviewSchema.post('save', async function(){
    await this.constructor.calculateAverageRating(this.product);
    console.log('save hook');
})

ReviewSchema.post('deleteOne', { document: true }, async function(){
    await this.constructor.calculateAverageRating(this.product);
    console.log('delete hook');
})

module.exports = mongoose.model('Review', ReviewSchema);