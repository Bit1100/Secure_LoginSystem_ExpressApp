const express = require('express');
const bcryptjs = require('bcryptjs');
const auth = require('../middleware/auth');
const router = express.Router();
const { Service, Client } = require('../models/schema/schemaDef');

// Routes
router.get('/', async (req, res, next) => {
  const result = await Service.find();
  res.status(200).render('index', { cards: result });
});

router.get('/register', async (req, res, next) => {
  try {
    res.status(200).render('register');
  } catch (e) {
    res.status(400).send('Problem with Register Page');
  }
});

router.get('/login', async (req, res, next) => {
  try {
    res.status(200).render('login');
  } catch (e) {
    res.status(400).send('Problem with Login Page');
  }
});

router.post('/register', async (req, res) => {
  try {
    // console.log(req.body);
    const userPassword = req.body.password;
    const userConfirmPassword = req.body.cpassword;
    if (userPassword === userConfirmPassword) {
      let client = await new Client({
        name: req.body.name,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        gender: req.body.gender,
        password: req.body.password,
        cpassword: req.body.cpassword,
      })

      // Creating Token
      const token = await client.generateAuthToken();

      res.cookie('Token', token, {
        expires: new Date(Date.now() + 600000),
        httpOnly: true   // Client Side Script Cannot change the Cookie
      })

      // Saving data to database after modifying it as required
      client = await client.save();

      // Redirecting to the login Page
      res.status(201).redirect('/login');
    }
  } catch (e) {
    res.status(400).send('Invalid Data Entries');
  }
});

router.post('/login', async (req, res) => {
  try {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const userData = await Client.findOne({ email: userEmail });
    const isMatch = await bcryptjs.compare(userPassword, userData.password);

    // Creating Token
    const token = await userData.generateAuthToken();

    res.cookie('userToken', token, {
      expires: new Date(Date.now() + 600000),
      httpOnly: true,   // Client Side Script Cannot change the Cookie
      // secure: true
    })

    if (isMatch) {
      res.status(200).redirect('/');
    }
  } catch (e) {
    res.status(400).send('Invalid Credentials');
  }

});

router.get('/logout', auth, async (req, res) => {
  // For Single Logout
  // req.user.tokens = req.user.tokens.filter(singleToken => singleToken.token !== req.token)
  try {
    let tokens = req.user.tokens;
    // Removing all login user from same email and password from the DB
    req.user.tokens = tokens.filter(item => {
      if (tokens.indexOf(item) === 0) {
        return item;
      }
    });

    res.clearCookie('userToken');

    await req.user.save();
    console.log(req.user.tokens);
    res.redirect('/login');
  } catch (e) {
    res.status(400).send("First Login and Then Logout");
  }
});

router.get('/about', auth, (req, res) => {
  // check in middleware for better
  try {
    res.status(200).render('about');
  } catch (e) {
    res.status(200).send('Please Login to Access this page');
  }
});

router.get('/register/*', (req, res, next) => {
  res.status(404).render('error');
});

router.get('/login/*', (req, res, next) => {
  res.status(404).render('error');
});

router.get('/logout/*', (req, res, next) => {
  res.status(404).render('error');
});

router.get('*', (req, res, next) => {
  res.status(404).render('error');
});

module.exports = router;
