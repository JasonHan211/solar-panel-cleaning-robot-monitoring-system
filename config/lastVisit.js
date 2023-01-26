const User = require("../models/user")

module.exports =  function(req,res,next) {
        
    let user = req.user
    user.lastPage = req.originalUrl
    user.save()
    
    return next()
}
