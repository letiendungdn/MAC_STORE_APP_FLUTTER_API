const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        trim: true,
        require: true,
    },
    productPrice: {
        type: Number,
        require: true,
    },
    quantity: {
        type: Number,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    subCategory: {
        type: String,
        require: true,
    },
    image: [{
        type: String,
        require: true,
    },],
    popular: {
        type: Boolean,
        default: true,
    },
    recommend: {
        type: Boolean,
        default: true,
    },
})

const Product = mongoose.model("Product",productSchema)

module.exports = Product;