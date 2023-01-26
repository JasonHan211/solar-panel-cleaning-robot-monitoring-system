const express = require('express')
const router  = express.Router()
const fetch = require('node-fetch')
const Site = require("../models/site")
const Weather = require("../models/weather")
const {ensureAuthenticated,ensureNotAuthenticated} = require('../config/auth')

// Main page
router.get('/',ensureAuthenticated, (req,res) => {
    res.redirect('/dashboard')
})

// Update notes
router.post('/update_notes',ensureAuthenticated, async (req,res) => {
    
    let siteId = req.body.site_id
    let notes= req.body.notes

    try {
        let site = await Site.findById(siteId)
        site.notes = notes
        await site.save()
    
        response = {
            status:'ok'
        }
    
        res.json(response)

    } catch(err) {
        console.log(err)
        res.json({status:'fail',err:err})
    }
    
})

// Get request test
router.get('/get_test', async(req,res) => {
    console.log('Get requested')

    // try {
    //     const siteId = '6232e4262bf48f688c3db71b'
    //     const site = await Site.findById(siteId)
    //     const key = process.env.WEATHER_KEY

    //     let baseTime = 1640995200 // 1/1/2021

    //     for (let day = 0; day < 107; day++) {
            
    //         let time = baseTime + 86400*day

    //         const theDate = new Date()
    //         theDate.setTime(time*1000)
    //         console.log(theDate)

    //         const response = await fetch('https://api.darksky.net/forecast/'+key+'/'+site.lat+','+site.long+','+time+'?units=si')
    //         const weatherData = await response.json()

    //         let data = {
    //             weather : weatherData,
    //             site : site
    //         }
    //         const weather = new Weather(data)
    //         await weather.save()
    //         .then(() => {
    //             console.log('Weather recorded')
    //         })
    //         .catch(value => console.log(value))

    //     }

    //     res.json({status:"Weather fetched"})

    // } catch(err) {
    //     console.log(err)
    //     res.json({status:'fail',err:err})
    // }

})

// Post request test
router.post('/post_test', async(req,res) => {
    let data = req.body
    console.log(data)
})

module.exports = router