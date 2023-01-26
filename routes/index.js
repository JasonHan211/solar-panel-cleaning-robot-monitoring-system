const express = require('express')
const router  = express.Router()
const {ensureAuthenticated,ensureNotAuthenticated} = require('../config/auth') 

//Main page
router.get('/',ensureAuthenticated, (req,res) => {

    let page = '/dashboard'
    if (req.user.lastPage) {
        page = req.user.lastPage
    }

    res.redirect(page)
})

module.exports = router