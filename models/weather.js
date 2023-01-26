const mongoose = require('mongoose');

const WeatherSchema  = new mongoose.Schema({
    weather: {
        type: Object,
        required: true
    },
    site: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Site'
    }
    
},{timestamps: true});

const Weather = mongoose.model('Weather',WeatherSchema);

module.exports = Weather;