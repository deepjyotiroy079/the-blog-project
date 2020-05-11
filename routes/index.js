const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Blog = require('../models/Blogs');
// const User = require('../models/Users');
router.get('/', (req, res)=>{
    res.render('welcome')
})

// dashboard
router.get('/dashboard', ensureAuthenticated, (req, res)=>{
    // const all_blogs = [];
    res.render('dashboard', {
        user: req.user
    });
})

router.get('/dashboard/create', (req, res)=>{
    res.render('create', {
        user: req.user
    })
})
// handling posting of blog
router.post('/dashboard/create', (req, res)=>{

    // console.log(req.body);
    const { title, content, author, date } = req.body;
    let errors = [];

    // checking if all fields are there or not
    if(!title || !content) {
        errors.push({
            msg: 'Please fill in all the fields'
        })
    }

    if(errors.length > 0) {
        res.render('create', {
            title,
            content,
        })
    } else {
        // res.send('pass');
        // all validation passed
        const newBlog = new Blog({
            title,
            content,
            author: req.user._id
        });

        newBlog.save()
            .then(user => {
                req.flash('success_msg', 'Your blog has successfully been created');
                res.redirect('/dashboard');
            })
            .catch(err => console.log(err));
    }
})
module.exports = router;