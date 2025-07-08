const { type } = require('express/lib/response')
const mongoose = require('mongoose')

const productReviewSchema = mongoose.Schema({
    buyerId: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    fullName: {
        type: String,
        require: true,
    },
    productId: {
        type: String,
        require: true,
    },
    rating: {
        type: Number,
        require: true,
    },
    review: {
        type: String,
        require: true,
    },

})

const ProductReview = mongoose.model("ProductReview",productReviewSchema)

module.exports = ProductReview;