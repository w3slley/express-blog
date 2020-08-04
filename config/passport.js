const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/User.js')

module.exports = function(passport){

    passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'},
        function(email, password, done) {
          User.findOne({ email: email }, function(err, user) {
            if (err) return done(err)
            if (!user) {
                return done(null, false)
            }
            bcrypt.compare(password, user.password, (err, res)=>{
                if(err) return done(err)
                if(res){
                    return done(null, user)
                }
                else{
                    return done(null, false)
                }
            }) 
          })
        }
      ))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

}
