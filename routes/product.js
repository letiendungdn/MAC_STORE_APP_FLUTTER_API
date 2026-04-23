const express = require("express");
const Product = require("../models/product");
const {auth, vendorAuth } = require("../middleware/auth");
const productRouter = express.Router();

productRouter.post('/api/add-products',auth,vendorAuth, async (req, res) => {
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
productRouter.get('/api/products-by-category/:category', auth, vendorAuth, async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category, popular: true });
        if (!products || products.length == 0) {
            return res.status(404).json({ msg: "Product not found" });
        } else {
            return res.status(200).json(products);
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// new route for retrieving related products by subcategory
productRouter.get('/api/related-products-by-subcatagory/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        // first, find the product to get its subcategory
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }

        // find related products based on the subcategory and exclude current product
        const relatedProducts = await Product.find({
            subCategory: product.subCategory,
            _id: { $ne: productId },
        });

        if (!relatedProducts || relatedProducts.length == 0) {
            return res.status(404).json({ msg: "No related products found" });
        }

        return res.status(200).json(relatedProducts);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// route for retrieving the top 10 highest-rated products
productRouter.get('/api/top-rated-products', async (req, res) => {
    try {
        // fetch all products sorted by average rating in descending order and limit to 10
        const topRatedProducts = await Product.find({}).sort({ averageRating: -1 }).limit(10);
        if (!topRatedProducts || topRatedProducts.length == 0) {
            return res.status(404).json({ msg: "No top-rated products found" });
        }

        return res.status(200).json(topRatedProducts);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});




module.exports = productRouter;
