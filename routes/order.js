const express = require("express");
const Order = require("../models/order");
const stripe = require("stripe")("sk_test_51QLDePAmIU5CvhmkLukzvm0oGBRWfYPMzxVt0sAV2mpNYGPWwqcm3BkbPJ");
const { auth, vendorAuth } = require("../middleware/auth");

const orderRouter = express.Router();

///Post route for creating orders
orderRouter.post("/api/orders", auth, async (req, res) => {
    try {
        const {
            fullName,
            email,
            state,
            city,
            locality,
            productName,
            productPrice,
            quantity,
            category,
            image,
            vendorId,
            buyerId,
        } = req.body;

        const createdAt = new Date().getMilliseconds();

        const order = new Order({
            fullName,
            email,
            state,
            city,
            locality,
            productName,
            productPrice,
            quantity,
            category,
            image,
            vendorId,
            buyerId,
            createdAt,
        });

        await order.save();

        const customer = await stripe.customers.create({
            name: fullName,
            email: email,
        });

        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: "2023-10-16" }
        );

        const paymentIntent = await stripe.paymentIntents.create({
            amount: productPrice * quantity * 100,
            currency: "usd",
            customer: customer.id,
        });

        return res.status(201).send({
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
        });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

//payment api
orderRouter.post("/api/payment", async (req, res) => {
    try {
        const { orderId, paymentMethodId, currency = "usd" } = req.body;

        if (!orderId || !paymentMethodId || !currency) {
            return res.status(400).json({ msg: "Missing required fields" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            console.log("order not found", orderId);
            return res.status(404).json({ msg: "Order not found" });
        }

        //calculate the total amount(price * quantity)
        const totalAmount = order.productPrice * order.quantity;

        //Ensure the amount is at least $0.50 USD or its equivalent
        const minimumAmount = 0.50;
        if (totalAmount < minimumAmount) {
            return res.status(400).json({ error: "Amount must be at least $0.50 USD" });
        }

        //convert total amount to cents(Stripe requires the amount in cents)
        const amountInCents = Math.round(totalAmount * 100);

        //Now create the Payment intent with the correct amount
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: currency,
            payment_method: paymentMethodId,
            automatic_payment_methods: { enabled: true },
        });

        return res.json({
            status: "success",
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
        });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

orderRouter.post("/api/payment-intent", async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });

        return res.status(200).json(paymentIntent);
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

// GET route for fetching all orders
orderRouter.get("/api/orders", async (req, res) => {
    try {
        const orders = await Order.find();
        return res.status(200).json(orders);
    } catch (e) {
        return res.status(500).json({ error: e.message });
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
orderRouter.delete("/api/orders/:id", auth, async (req, res) => {
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
            { delivered: true, processing: false },
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
            { processing: false, delivered: false },
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
