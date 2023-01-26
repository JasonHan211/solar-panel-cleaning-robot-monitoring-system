const express = require('express')
const router  = express.Router()
const Site = require("../models/site")
const SiteList = require("../models/siteList")
const {ensureAuthenticated,ensureNotAuthenticated} = require('../config/auth')
const saveLastVisit = require('../config/lastVisit')
const Robot = require('../models/robot')

//Details route
router.get('/',ensureAuthenticated, saveLastVisit, async (req,res) => {

    try {
        const siteList = await SiteList.find()

        let object = {
            user: req.user,
            siteList: siteList,
            site: null,
            page: 'details',
        }

        if (siteList.length == 0) {
            return res.render('details/index',{
                    info: object,
                    layout: '../views/layouts/dashboard'
            }) 
        }

        res.redirect(`/details/${siteList[0].site}`)
        
    } catch(err) {
        console.log(err)
        res.redirect('/users/logout')
    }
})

//Details page
router.get('/:id',ensureAuthenticated, saveLastVisit, async (req,res) => {

    try {
        const siteList = await SiteList.find()
        const site = await Site.findById(req.params.id)
        const robots = await Robot.find({site: req.params.id})

        let object = {
            user: req.user,
            siteList: siteList,
            site: site,
            robots: robots,
            page: 'details',
        }
        
        res.render('details/index',{
            info: object,
            layout: '../views/layouts/dashboard'
        })

    } catch(err) {
        console.log(err)
        res.redirect('/users/logout')
    }

})

module.exports = router