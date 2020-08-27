const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// loading the user model
const User = require('../models/Users');

module.exports = (passport) => {
    passport.use(new localStrategy({ usernameField: 'username' }, (username, password, done)=>{
        // match user
        User.findOne({ username: username })
            .then(user => {
                if(!user) {
                    return done(null, false, { message: 'That username is not registered' });
                }

                // match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                      return done(null, user);
                    } else {
                      return done(null, false, { message: 'Password incorrect' });
                    }
                });
            })
    }));

    passport.serializeUser((user, done)=>{
        done(null, user.id);
    })
    passport.deserializeUser((id, done)=>{
        User.findById(id, (err, user)=>{
            done(err, user);
        })
    })
}