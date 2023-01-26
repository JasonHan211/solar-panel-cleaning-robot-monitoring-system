const mongoose = require('mongoose');

const SiteListSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    site: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Site'
    }
    
},{timestamps: true});

const SiteList = mongoose.model('SiteList',SiteListSchema);

module.exports = SiteList;