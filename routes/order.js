const express = require("express");
const Order = require("../models/order");

const orderRouter = express.Router();

// Create a new order
orderRouter.post("/api/orders", async (req, res) => {
    try {
        const {
            fullName,
            email,
            state,
            locality,
            productName,
            productPrice,
            quantity,
            category,
            image,
            buyerId,
            vendorId,
        } = req.body;
         const createdAt = new Date().getMilliseconds();

        const order = new Order({
            fullName,
            email,
            state,
            locality,
            productName,
            productPrice,
            quantity,
            category,
            image,
            buyerId,
            vendorId,
            createdAt,
        });

       
        await order.save();
        return res.status(201).send(order);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

module.exports = orderRouter;
