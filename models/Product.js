const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: [true, 'Please provide product name'],
        maxlength: [100, 'No more than 100 characters']
    },
    price:{
        type: Number,
        required: [true, 'Please provide product price'],
    },
    description:{
        type: String,
        required: [true, 'Please provide product description'],
        maxlength: [1000, 'No more than 1000 characters']
    },
    image:{
        type: String,
        default: '/uploads/example.jpeg'
    },
    category:{
        type: String,
        required: [true, 'Please provide product category'],
        enum: ['office', 'kitchen', 'bedroom']
    },
    company:{
        type: String,
        required: [true, 'Please provide product company'],
        enum: ['ikea', 'liddy', 'marcos']
    },
    colors:{
        type: [String],
        required: [true, 'Please provide product colors'],
        
    },
    featured:{
        type: Boolean,
        default: false
    },
    freeShipping:{
        type: Boolean,
        default: false
    },
    inventory:{
        type: Number,
        required: [true, 'Please provide product inventory'],
        default: 15
    },
    averageRating:{
        type: Number,
        default: 0
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{ timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);