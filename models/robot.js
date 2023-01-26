const mongoose = require('mongoose');

const RobotSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    
    site: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Site'
    }
    
},{timestamps: true});

const Robot = mongoose.model('Robot',RobotSchema);

module.exports = Robot;