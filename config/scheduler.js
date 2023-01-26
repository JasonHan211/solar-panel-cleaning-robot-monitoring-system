const schedule = require('node-schedule')
const fetch = require('node-fetch')
const Site = require("../models/site")
const SiteList = require("../models/siteList")
const Weather = require("../models/weather")

module.exports = {
    
    getDailyWeather : function () {
    const rule = new schedule.RecurrenceRule()
    rule.hour = 0
    rule.minute = 0
    rule.second = 0
    rule.tz = 'Asia/Kuala_Lumpur'

    job = schedule.scheduleJob(rule, async function(){
        
        try {

            const siteList = await SiteList.find()

            siteList.forEach(async (siteInfo) => {
                const siteObject = siteInfo.site
                const site = await Site.findById(siteObject)

                const key = process.env.WEATHER_KEY

                let date = new Date()
                date.setDate(date.getDate()-1)
                let time = Math.round(date.getTime()/1000)

                const theDate = new Date()
                theDate.setTime(time*1000)

                const response = await fetch('https://api.darksky.net/forecast/'+key+'/'+site.lat+','+site.long+','+time+'?units=si')
                const weatherData = await response.json()

                let data = {
                    weather : weatherData,
                    date : theDate,
                    site : site
                }

                const weather = new Weather(data)

                await weather.save()
                .then(() => {
                    console.log(theDate + ' : Weather recorded')
                })
                .catch(value => console.log(value))

            });

        } catch(err) {
            console.log(err)
        }

    });

    console.log("Scheduler initiated")

    return job

    },
    shutdownScheduler : function() {
        schedule.gracefulShutdown()
    },
    cancelSchedule : function(job) {
        job.cancel()
    }

}
