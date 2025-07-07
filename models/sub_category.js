const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
    categoryId: {
        type: String,
        require: true,
    },
    categoryName: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
    subCategoryName: {
        type: String,
        require: true,
    }
})

const subCategory = mongoose.model("SubCategory",subCategorySchema)

module.exports = subCategory;