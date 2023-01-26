const express = require('express')
const router = express.Router()
const User = require("../models/user")
const bcrypt = require('bcrypt')
const passport = require('passport')
const validator = require("email-validator")
const {ensureAuthenticated,ensureNotAuthenticated} = require('../config/auth') 

//Get login
router.get('/login',ensureNotAuthenticated, (req,res) => {
    res.render('auth/login')
})

//Login handle
router.post('/login',(req,res,next) => {
    passport.authenticate('local', {
        successRedirect : '/',
        failureRedirect: '/users/login',
        failureFlash : true
    })(req,res,next)
})

//Get register
router.get('/register',ensureNotAuthenticated, (req,res) => {
    res.render('auth/register')
})

//Register handle
router.post('/register',(req,res) => {

    const {name,email, password, password2, referralCode} = req.body

    let errors = []

    console.log('Name: ' + name + ' email: ' + email + ' pass: ' + password + ' referralCode: ' + referralCode)

    if(!name || !email || !password || !password2 || !referralCode) {
        errors.push({msg: "Please fill in all fields"})
    }

    /*Check email
    if(!validator.validate(email)) {
        errors.push({msg: "ensure correct email"})
    }*/

    //Possible addition of password strength checker

    //Check if match
    if(password !== password2) {
        errors.push({msg: "passwords dont match"})
    }

    //Check if password is more than 6 characters
    if(password.length < 6 ) {
        errors.push({msg: 'password atleast 6 characters'})
    }

    //Check for referral code
    if(referralCode !== process.env.REFERRAL_CODE) {
        errors.push({msg: 'referral code invalid'})
    }

    if(errors.length > 0 ) {
        return res.render('auth/register', {
            errors: errors,
            name: name,
            email: email,
            password: password,
            password2: password2,
            referralCode: referralCode
        })
    }
    
    //Validation passed
    User.findOne({email: email}).exec((err,user) => {

        console.log('User exist: ' + user)

        if(user) {
            errors.push({msg: 'email already registered'})
            res.render('register',{
                errors,
                name,
                email,
                password,
                password2
            })  
        } else {
            const newUser = new User({
                name: name,
                email: email,
                password: password,
                referralCode: referralCode
            })

            //hash password
            bcrypt.genSalt(10,(err,salt) => 
                bcrypt.hash(newUser.password,salt,
                (err,hash) => {

                    if(err) throw err

                    //save pass to hash
                    newUser.password = hash

                    //save user
                    newUser.save()

                    .then((value) => {
                        console.log('MongoDB stored: ' + value)
                        req.flash('success_msg','You have now registered!')
                        res.redirect('/users/login')
                    })
                    .catch(value => console.log(value))
            }));
        }
    })
})

//Logout
router.get('/logout',ensureAuthenticated, (req,res) => {
    req.logout()
    req.flash('success_msg','Now logged out')
    res.redirect('/users/login')
})

module.exports  = router