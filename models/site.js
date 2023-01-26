const mongoose = require('mongoose');

const SiteSchema  = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    postcode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    long: {
        type: String,
        required: true
    },
    lat: {
        type: String,
        required: true
    },
    notes: {
        type: String,
    }
    
},{timestamps: true});

const Site = mongoose.model('Site',SiteSchema);

module.exports = Site;