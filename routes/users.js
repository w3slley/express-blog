/*jshint esversion: 6 */
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')

let User = require('../models/User.js')


//Login process
router.post('/login', function(req, res, next){//This is how you make the authentication to work...
    passport.authenticate('local', function(err, user, info){
        if(req.body.email == '' || req.body.password == ''){//if there are empty fields
            req.session.flash = {
                type: 'danger',
                intro: 'Empty fields!',
                message: 'Please insert your information in the empty fields.'
               
            }
            return res.redirect('/login')    
        }
        if(!user){//when email is not correct
            req.session.flash = {
                type: 'danger',
                intro: 'Email or password incorrect!',
                message: 'Please insert your information again.'
               
            } 
            return res.redirect('/login')
        }
        req.login(user, function(err){
            if(err){//when email is correct but password isn't
                req.session.flash = {
                    type: 'danger',
                    intro: 'Email or password incorrect!',
                    message: 'Please insert your information again.'   
                }
                return next(err)
            }
            else{//when user inserts correct email and password
                req.session.flash = {
                    type: 'success',
                    intro: 'You are now logged in.',
                    message: 'Welcome '+' '+req.user.name+'!'
                }
                return res.redirect('/dashboard')
            } 
        })
    })(req, res, next)
})
    
    

//Logout
router.get('/logout', (req, res)=>{
    req.logout()
    res.redirect('/')
})
//Register process
router.post('/register', (req, res)=>{
    let name = req.body.name 
    let email = req.body.email 
    let username = req.body.username 
    let password = req.body.password 
    let repeat = req.body.repeatPassword
    if(password != repeat){
        req.session.flash = {
            type: 'danger',
            intro: 'The passwords are not equal! ',
            message: 'Please insert your password again.',
        };
        return res.redirect('/register')

    }
    else if(name=='' || email == '' || username =='' ||password == '' ||repeat == '' ){
        req.session.flash = {
            type: 'danger',
            intro: 'Empty fields! ',
            message: 'Please insert information in the empty fields.',
        };
        return res.redirect('/register')
    }
    else{
        req.session.flash = {
            type: 'success',
            intro: 'Thank you! ',
            message: 'You have been successfuly signed up! Please login into your account.',
        }
        bcrypt.hash(password, 10, (err, hash)=>{//Hashing password
            let newUser = new User({name: name, email: email, username: username, password: hash});
            newUser.save((err)=>{
                if (err) return console.error(err);
            })

            return res.redirect(303, '/login')
        });
    
        
    }

});

//access control function
//I already have this function in the posts.js. I have to find another way to do this
function protected(req, res){
    if(res.locals.user){
        return next()
    }
    else{
        res.redirect('/login')
    }
}

module.exports = router