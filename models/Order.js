const mongoose = require("mongoose");

const SingleCartItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
    }
})

const OrderSchema = new mongoose.Schema({
    tax: {
        type: Number,
        required: true
    },
    shippingFee: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "failed", "paid", "delivered", "canceled"]
    },
    clientSecret: {
        type: String,
        required: true
    },
    paymentIntentId: {
        type: String
    },

    cartItems: {
        type: [SingleCartItemSchema]
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }

},
{timestamps: true}
);

module.exports = mongoose.model('Order', OrderSchema);