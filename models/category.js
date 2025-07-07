const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
    banner: {
        type: String,
        require: true,
    }
})

const Category = mongoose.model("Category",CategorySchema)

module.exports = Category;