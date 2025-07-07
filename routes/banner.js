const express = require("express");
const Banner = require("../models/banner")
const bannreRouter = express.Router();

bannreRouter.post('/api/banner', async (req, res) => {
    try {
        const { image } = req.body;
        const banner = new Banner({image});
        await banner.save();
        return res.status(201).send(banner);
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

bannreRouter.get('/api/banner', async (req, res) => {
    try {
       
        await banner.find();
        return res.status(200).send(banner);
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})


module.exports = bannreRouter;