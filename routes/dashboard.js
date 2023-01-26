const express = require('express')
const router  = express.Router()
const fetch = require('node-fetch')
const Site = require("../models/site")
const SiteList = require("../models/siteList")
const Robot = require('../models/robot')
const {ensureAuthenticated,ensureNotAuthenticated} = require('../config/auth')
const saveLastVisit = require('../config/lastVisit')
const Weather = require('../models/weather')

//Dashboard router
router.get('/',ensureAuthenticated, saveLastVisit, async (req,res) => {

    try {
        const siteList = await SiteList.find()

        let object = {
            user: req.user,
            siteList: siteList,
            site: null,
            page: 'dashboard',
        }

        if (siteList.length == 0) {
            return res.render('dashboard/index',{
                    info: object,
                    layout: '../views/layouts/dashboard'
            }) 
        }
        res.redirect(`/dashboard/${siteList[0].site}`)
        
    } catch(err) {
        console.log(err)
        res.redirect('/users/logout')
    }
})

//Dashboard page
router.get('/:id',ensureAuthenticated, saveLastVisit, async (req,res) => {

    try {
        const siteList = await SiteList.find()
        const site = await Site.findById(req.params.id)
        const robots = await Robot.find({site: req.params.id})
        const historicalWeather = await Weather.find({site: req.params.id})
        const key = process.env.WEATHER_KEY
        const response = await fetch('https://api.darksky.net/forecast/'+key+'/'+site.lat+','+site.long+'?units=si&exclude=minutely,hourly,daily,alerts,flags')
        const weather = await response.json();

        let object = {
            user: req.user,
            siteList: siteList,
            site: site,
            weather: weather,
            historicalWeather: historicalWeather,
            robots: robots,
            page: 'dashboard',
        }

        res.render('dashboard/index',{
            info: object,
            layout: '../views/layouts/dashboard'
        })

    } catch(err) {
        console.log(err)
        res.redirect('/users/logout')
    }

})

module.exports = router