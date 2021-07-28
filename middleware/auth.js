const jwt = require('jsonwebtoken');

const { Client } = require('../models/schema/schemaDef');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.userToken;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log("Verify: ", verifyUser);  // Returns the Payload

        const user = await Client.findOne({ _id: verifyUser._id });
        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(400).send('Please Login to Access this page')
    }
}

module.exports = auth;