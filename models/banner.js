const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema({
    image: {
        type: String,
        require: true,
    },
})

const Banner = mongoose.model("Banner",bannerSchema)

module.exports = Banner;