// import the express module
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const bannreRouter = require("./routes/banner");
const categoryRouter = require("./routes/category");
const subCategoryRouter = require("./routes/sub_category");
const productRouter = require("./routes/product");
const productReviewRouter = require("./routes/product_review");
const orderRouter = require("./routes/order");
const vendorRouter = require("./routes/vendor");
const cors = require("cors");

// Defined the port number the server will listen on
const PORT = 3000;

// create an instance of an express application
// because it give us the starting point
const app = express();
//mongodb string
const DB = "mongodb+srv://letiendungdt:1234@cluster0.2lqxv1q.mongodb.net/"
//middleware - to register routes or to mount routes
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use(authRouter);
app.use(bannreRouter);
app.use(categoryRouter);
app.use(subCategoryRouter);
app.use(productRouter);
app.use(productReviewRouter);
app.use(orderRouter);
app.use(vendorRouter);
//connect to mongodb

mongoose.connect(DB).then(() => {
console.log('mongodb connected');
})

//start the server and listen on the specified port
app.listen(PORT,"0.0.0.0",function(){
    //LOG THE NUMBER
    console.log(`server is running on port ${PORT}`);
})
