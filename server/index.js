// Importing the Modules
require("dotenv").config();    // Parse the .env file into object and provide the object to process.env
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const router = require('../routes/index');
require('../models/db/conn');

// Initializing Express App
const app = express();

// Middleware to recognize incoming data as JSON object
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// It populates req with cookies key
app.use(cookieParser());

// Using in-built middleware
app.use("/static", express.static(path.join(__dirname, '../public')));

// Using the router from the separate file => User-defined Middleware
app.use('/', router);

// Setting the PORT
const port = process.env.PORT || 3000;

// View Engine Set-Up
app.set('views', path.join(__dirname, '../templates', 'views'));
app.set('view engine', 'hbs');

// Register the partials
hbs.registerPartials(path.join(__dirname, '../templates', 'partials'));

// Listening Request at the port
app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server running at PORT ${port}`);
});
