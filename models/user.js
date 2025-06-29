const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value) => {
                const result =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return result.test(value)
            },
            message: "Please enter a valid email address",
        }
    },
    state: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
     locality: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        require: true,
            validate: {
            validator: (value) => {
                // check if password is at least 9 characters long
                return value.length >=8
            },
            message: "password must  be at least 8 characters long",
        }
    }
})

const User = mongoose.model("User",userSchema)

module.exports = User;