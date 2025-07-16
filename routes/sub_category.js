const express = require("express");
const SubCategory = require("../models/sub_category")
const subCategoryRouter = express.Router();

subCategoryRouter.post('/api/subcategories', async (req, res) => {
    try {
        const { categoryId,categoryName,image,subCategoryName } = req.body;
        const subCategory = new SubCategory( { categoryId,categoryName,image,subCategoryName });
        await subCategory.save();
        return res.status(201).send(subCategory);
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

subCategoryRouter.get('/api/subcategories', async (req, res) => {
    try {
        const subCategories = await SubCategory.find();
        return res.status(200).send(subCategories);
    }
    catch (e) {
        res.status(500).json({error: e.message})
    }
})


subCategoryRouter.get('/api/category/:categoryName/subcategories', async (req, res) => {
    try {
        // extract the categories are found, respons with a status code 404 error
        const { categoryName } = req.params;
        const subCategories = await SubCategory.find({categoryName});

        // check if any subcategories found
        if(!subCategories || subCategories.length ==0 ){
            //  if no subcategories are found, respons with a status  code 404 error
            return res.status(404).json({msg: "subcategories not found"})
        } else {
            return res.status(200).json(subCategories)
        }
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})



module.exports = subCategoryRouter;