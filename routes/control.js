const express = require('express')
const router  = express.Router()
const Site = require("../models/site")
const SiteList = require("../models/siteList")
const Robot = require('../models/robot')
const {ensureAuthenticated,ensureNotAuthenticated} = require('../config/auth') 
const saveLastVisit = require('../config/lastVisit')

//Control router
router.get('/',ensureAuthenticated, saveLastVisit, async (req,res) => {

    try {
        const siteList = await SiteList.find()

        let object = {
            user: req.user,
            siteList: siteList,
            site: null,
            page: 'control',
        }

        if (siteList.length == 0) {
            return res.render('control/index',{
                info: object,  
                layout: '../views/layouts/dashboard'
            }) 
        }

        res.redirect(`/control/${siteList[0].site}`)
        
    } catch {
        res.redirect('/users/logout')
    }
})

//Control page
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
            page: 'control',
        }

        res.render('control/index',{
            info: object,
            layout: '../views/layouts/dashboard'
        })

    } catch {
        res.redirect('/users/logout')
    }

})
module.exports = router