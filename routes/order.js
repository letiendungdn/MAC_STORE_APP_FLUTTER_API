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
            processing,
            delivered,
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
            processing,
            delivered,
        });

       
        await order.save();
        return res.status(201).send(order);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

// GET route for fetching orders by buyer ID
orderRouter.get("/api/orders/:buyerId", async (req, res) => {
    try {
        // Extract the buyerId from the request parameters
        const { buyerId } = req.params;

        // Find all orders in the database that match the buyerId
        const orders = await Order.find({ buyerId });

        // If no orders are found, return a 404 status with a message
        if (orders.length === 0) {
            return res.status(404).json({ msg: "No Orders found for this buyer" });
        }

        // If orders are found, return them with a 200 status code
        return res.status(200).json(orders);
    } catch (e) {
        // Handle any errors that occur during the order retrieval process
        res.status(500).json({ error: e.message });
    }
});

module.exports = orderRouter;
