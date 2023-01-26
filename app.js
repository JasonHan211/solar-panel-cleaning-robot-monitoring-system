if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const app = express()
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require("passport")
const methodOverride = require('method-override')

//Passport config
require('./config/passport')(passport)

//MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
.then(() => console.log('connected to MongoDB'))
.catch((err)=> console.log(err))

//EJS
app.set('view engine','ejs')
app.use(expressEjsLayout)
app.set('layout', '../views/layouts/auth')
app.use(express.static('public'))
app.use(methodOverride('_method'))

//BodyParser
app.use(express.json())
app.use(express.urlencoded({extended : false}))

//Express session
app.use(session({
    secret : process.env.SESSION_SECRET || 'keyboard cat',
    resave : false,
    saveUninitialized : false,
    rolling: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 1 * 24 * 60 * 60
      })
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error  = req.flash('error')
    next()
    })
    
//Routined tasks
let {getDailyWeather} = require('./config/scheduler')
getDailyWeather()

//Routes
app.use('/',require('./routes/index'))
app.use('/api',require('./api/index'))
app.use('/users',require('./routes/users'))
app.use('/sites',require('./routes/sites'))
app.use('/dashboard',require('./routes/dashboard'))
app.use('/control',require('./routes/control'))
app.use('/details',require('./routes/details'))

app.listen(process.env.PORT || 3000)