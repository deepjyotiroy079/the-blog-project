const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/Users');
const passport = require('passport')
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));


router.get('/login', (req, res)=>{
    res.render('login')
})

router.get('/register', (req, res)=>{
    res.render('register')
})

// Handle registration
router.post('/register', (req, res)=>{
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // checking if all fields are there or not
    if(!name || !email || !password || !password2) {
        errors.push({
            msg: 'Please fill in all the fields'
        })
    }
    // checking if the passwords match
    if(password !== password2) {
        errors.push({
            msg: 'Passwords do not match'
        })
    }
    // checking the length of the password
    if(password.length < 6) {
        errors.push({
            msg: 'Password should be atleast of 6 characters.'
        }); 
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // res.send('pass');
        // all validation passed
        User.findOne({ email: email })
            .then(user => {
                if(user) {
                    // User exists
                    errors.push({ msg: 'Email is already registered' }); 
                    res.render('register', {
                        errors,
                        name, 
                        email,
                        password,
                        password2
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    // Hashing the password
                    bcrypt.genSalt(10, (err, salt) =>{
                        bcrypt.hash(newUser.password, salt, (err, hash)=>{
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered.');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        });
                    })
                }
            })
    }
})

// login handle
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// logout handle
router.get('/logout', (req, res, next)=>{
    req.logOut();
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/users/login');
})
module.exports = router;