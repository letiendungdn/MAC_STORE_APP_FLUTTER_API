const express = require("express");
const Category = require("../models/category")
const categoryRouter = express.Router();

categoryRouter.post('/api/categories', async (req, res) => {
    try {
        const { image,name,banner } = req.body;
        const category = new Category({ image,name,banner});
        await category.save();
        return res.status(201).send(banner);
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

categoryRouter.get('/api/categories', async (req, res) => {
    try {
        const category = await Category.find();
        return res.status(200).send(category);
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})


module.exports = categoryRouter;