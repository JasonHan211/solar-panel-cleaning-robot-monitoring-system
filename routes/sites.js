const express = require('express')
const router  = express.Router()
const Site = require("../models/site")
const SiteList = require('../models/siteList')
const {ensureAuthenticated,ensureNotAuthenticated} = require('../config/auth')

//Main page
router.get('/',ensureAuthenticated, (req,res) => {
    res.redirect('/dashboard')
})

//New page
router.get('/new',ensureAuthenticated, async (req,res) => {
    try {
        const siteList = await SiteList.find()

        let object = {
            user: req.user,
            page: 'new',
            siteList: siteList,
            site: {},
        }

        res.render('sites/new', {
            info: object,
            layout: '../views/layouts/dashboard'
        })
    } catch(err) {
        console.log(err)
        res.redirect('/users/logout')
    }
})

//New site
router.post('/new',ensureAuthenticated, (req,res) => {

    const site = {
        full_name: req.body.full_name,
        contact: req.body.contact,
        email: req.body.email,
        name: req.body.name,
        address: req.body.address,
        postcode: req.body.postcode,
        city: req.body.city,
        state: req.body.state,
        long: req.body.long,
        lat: req.body.lat
    }

    let errors = []

    if(!site.full_name || !site.contact || !site.email || !site.name || !site.address || !site.postcode || !site.city || !site.state || !site.long || !site.lat) {
        errors.push({msg: "Please fill in all fields"})
    }

    if(errors.length > 0 ) {
        return res.render('sites/new', {
            errors: errors,
            site: site
        })
    }

    Site.findOne({name: site.name}).exec((err,siteRes) => {

        if(siteRes) {
            errors.push({msg: 'site already existed'})
            res.render('sites/new',{
                errors,
                user: req.user,
                page: 'new',
                site: site,
                layout: '../views/layouts/dashboard'
            })  
        } else {

            const newSite = new Site(site)
            const newSiteList = new SiteList({
                name: newSite.name,
                site: newSite.id
            })
            newSite.save()
            newSiteList.save()
            .then((value) => {
                console.log('New Installation Site Added');
                req.flash('success_msg','Site added')
                res.redirect('/')
            })
            .catch(value => console.log(value))

        }
    })
})

//Edit page
router.get('/edit/:id',ensureAuthenticated, async (req,res) => {

    try {
        const siteList = await SiteList.find()
        const site = await Site.findById(req.params.id)

        let object = {
            user: req.user,
            siteList: siteList,
            site: site,
            page: 'edit',
        }

        res.render('sites/edit',{
            info: object,
            layout: '../views/layouts/dashboard'
        })

    } catch(err) {
        console.log(err)
        res.redirect('/users/logout')
    }
})

// Update site
router.put('/edit/:id',ensureAuthenticated, async (req, res) => {
    let site
    let siteList
  
    try {
        site = await Site.findById(req.params.id)
        siteList = await SiteList.find({site: req.params.id})

        site.full_name = req.body.full_name
        site.contact = req.body.contact
        site.email = req.body.email
        site.name = req.body.name
        site.address = req.body.address
        site.postcode = req.body.postcode
        site.city = req.body.city
        site.state = req.body.state
        site.long = req.body.long
        site.lat = req.body.lat

        siteList[0].name = site.name
    
        await site.save()
        await siteList[0].save()
        res.redirect(`/dashboard/${site.id}`)
    } catch(err) {
        console.log(err)
        res.redirect('/users/logout')
    }
})

// Delete site
router.delete('/delete/:id',ensureAuthenticated, async (req, res) => {
    let site
    let siteList
    try {
        site = await Site.findById(req.params.id)
        siteList = await SiteList.find({site: req.params.id})

        await site.remove()
        await siteList[0].remove()
        res.redirect('/dashboard')
    } catch(err) {
        console.log(err)
        redirect('/users/logout')
    }
  })

module.exports = router