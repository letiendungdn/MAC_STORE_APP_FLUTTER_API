// import the express module
const express = require("express");

const helloRoute = require('./routes/hello');

// Defined the port number the server will listen on
const PORT = 3000;

// create an instance of an express application
// because it give us the starting point
const app = express();

//middleware - to register routes or to mount routes
app.use(helloRoute)

//start the server and listen on the specified port
app.listen(PORT,"0.0.0.0",function(){
    //LOG THE NUMBER
    console.log(`server is running on port ${PORT}`);
})