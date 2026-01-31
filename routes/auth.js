const express = require("express");
const User = require('../models/user')
const bcrypt = require("bcryptjs");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");

authRouter.post('/api/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({msg: "user with same email already exist"})
        }else {
            //Generate a salt with a cost factor of 10
            const salt = await bcrypt.genSalt(10);
            // hash the password using the generate salt
            const hashedPassword = await bcrypt.hash(password,salt);
            let user = new User({fullname,email,password: hashedPassword});
            user = await user.save();
            res.json({user});
        }
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

// signin api endpoint

authRouter.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
       const findUser = await User.findOne({email});
        console.log("🚀 ~ authRouter.post ~ findUser:", findUser)
       if(!findUser) {
        return res.status(400).json({msg: "User not found with this email"});
       } else {
        const ismatch = await bcrypt.compare(password,findUser.password);
        if(!ismatch) {
            
            return res.status(400).json({msg: "Incorrect Password"});
        }else {
            const token = jwt.sign({id:findUser._id},"passwordkey");

            // remove sensitive information
            const {password, ...userWithoutPassword} = findUser._doc;
            console.log("🚀 ~ authRouter.post ~ password:", password)

            // send the respones
            res.json({token,user: userWithoutPassword})
        }
       }
      
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

//Put route for updating user's state, city and locality
authRouter.put('/api/users/:id', async (req, res) => {
    try {
        //Extract the 'id' parameter from the request URL
        const {id} = req.params;
        //Extract the "state", "city" and locality fields from the request body
        const {state, city, locality} = req.body;
        //Find the user by their ID and update the state, city and locality fields
        // the {new:true} option ensures the updated document is returned
        const udatedUser = await User.findByIdAndUpdate(
            id,
            {state, city, locality},
            {new:true},
        );

        // if no user is found, return 4040 page not found status with an error message
        if(!udatedUser) {
            return res.status(404).json({error: "User not found"});
        }
        return res.status(200).json(udatedUser);
    } catch (error) {
        res.status(500).json({error:e.message});
    }
});

module.exports = authRouter;