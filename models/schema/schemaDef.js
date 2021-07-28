// Importing the modules
const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Defining the Service Resources API Schema
const client = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minLength: [4, "Minimium 4 Character Name Required"]
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true,
        validate(v) {
            if (!validator.isEmail(v)) {
                throw new Error("E-mail is invalid");
            }
        }
    },
    mobileNumber: {
        type: String,
        required: true,
        maxLength: 10,
        unique: true,
        validate(mobilenumber) {
            if (!validator.isMobilePhone(mobilenumber)) {
                throw new Error("Invalid Phone Number");
            }
        }
    },
    gender: {
        type: String,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
    },
    cpassword: {
        type: String,
        required: true,
        minLength: 5,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// Defining the Home Services API Schema
const service = new mongoose.Schema({
    head1: {
        type: String,
        required: true,
    },
    head2: {
        type: String,
        required: true,
    },
    para: {
        type: String,
        validate(v) {
            if (!v) {
                return "Para Cannot be empty"
            }
        },
        required: true,
    },
    link: {
        type: String,
        validate(v) {
            if (!v) {
                return "Link Cannot be empty"
            }
        },
        required: true,
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

// Middleware to create token
client.methods.generateAuthToken = async function () {
    try {
        const token = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token });
        await this.save();
        return token;
    } catch (e) {
        res.status(400).send('Token not Generated')
    }
}

// Middleware between fetching data from client and saving data to db
client.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 10);
    }
    if (this.isModified('cpassword')) {
        this.cpassword = await bcryptjs.hash(this.cpassword, 10);;
    }
    next();
});

// Creating a Model based on Schema
const Service = new mongoose.model(process.env.HOME_SCHEMA, service);
const Client = new mongoose.model(process.env.CLIENT_SCHEMA, client);

module.exports = { Service, Client };
