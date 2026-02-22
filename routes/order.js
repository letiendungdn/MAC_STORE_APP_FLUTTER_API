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
orderRouter.get("/api/orders/buyer/:buyerId", async (req, res) => {
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

// GET route for fetching orders by vendor ID
orderRouter.get("/api/orders/:vendorId", async (req, res) => {
    try {
        // Extract the vendorId from the request parameters
        const { vendorId } = req.params;

        // Find all orders in the database that match the vendorId
        const orders = await Order.find({ vendorId });

        // If no orders are found, return a 404 status with a message
        if (orders.length === 0) {
            return res.status(404).json({ msg: "No Orders found for this vendor" });
        }

        // If orders are found, return them with a 200 status code
        return res.status(200).json(orders);
    } catch (e) {
        // Handle any errors that occur during the order retrieval process
        res.status(500).json({ error: e.message });
    }
});

//Delete route for deleting a specific order by _id
orderRouter.delete("/api/orders/:id", async (req, res) => {
    try {
        //extract the id from the request parameter
        const { id } = req.params;
        //find and delete the order from the database using the extracted _id
        const deletedOrder = await Order.findByIdAndDelete(id);
        //check if an order was found and deleted
        if (!deletedOrder) {
            //if no order was found with the provided _id return 404
            return res.status(404).json({ msg: "Order not found" });
        } else {
            //if the order was successfully deleted , return 200 status  with a success message
            return res.status(200).json({ msg: "Order was deleted successfully" });
        }
    } catch (e) {
        //if an error occures during the process, return a 500 status with the error message
        res.status(500).json({ error: e.message });
    }
});

// Update order delivery status
orderRouter.patch("/api/orders/:id/delivered", async (req, res) => {
    try {
        const { id } = req.params;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { delivered: true },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ msg: "Order not found" });
        }

        return res.status(200).json(updatedOrder);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

// Update order processing status
orderRouter.patch("/api/orders/:id/processing", async (req, res) => {
    try {
        const { id } = req.params;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { processing: false },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ msg: "Order not found" });
        }

        return res.status(200).json(updatedOrder);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

module.exports = orderRouter;
