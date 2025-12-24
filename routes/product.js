const express = require("express");
const Product = require("../models/product")
const productRouter = express.Router();

productRouter.post('/api/add-products', async (req, res) => {
    try {
        const { productName,productPrice,quantity,description,category, vendorId,fullName ,subCategory,image } = req.body;
        const product = new Product({productName,productPrice,quantity,description,category,subCategory,image,vendorId,fullName});
        await product.save();
        return res.status(201).send(product);
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

productRouter.get('/api/recommended-products', async (req, res) => {
    try {
        const product = await Product.find({popular:true});
        if(!product || product.length ==0 ){
            //  if no subcategories are found, respons with a status  code 404 error
            return res.status(404).json({msg: "products not found"})
        } else {
            return res.status(200).json(product)
        }
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

// new route for retrieving products by category
productRouter.get('/api/products-by-category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });
        if (!products || products.length == 0) {
            return res.status(404).json({ msg: "Product not found" });
        } else {
            return res.status(200).json(products);
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});




module.exports = productRouter;
