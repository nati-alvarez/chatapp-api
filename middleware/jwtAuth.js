const jwt = require("jsonwebtoken");

module.exports = function(req, res, next){
    var token = req.headers['x-access-token'];
    if(token){
        jwt.verify(token, process.env.SECRET, function(err, user) {

            if (err) {
              return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });    
            } else {

              // save user data to req object
              req.user = user;    

              //check if current logged in user is authorized to perform an action
              if(req.user.username === req.params.username && req.user.username === req.body.username) req.authorized = true;
              next();
            }
        });
    }else {
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    }
}