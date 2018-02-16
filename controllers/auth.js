const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require('uuid/v1');

exports.login = function(req, res){
    global.DB.query(
        "SELECT *  FROM `users` WHERE `username` = ?",
        [req.body.username],
        (err, user)=>{
            //server error
            console.log(err);
            if(err) return res.status(500).json({success: false, err, message: "An error occurred"});

            //user not found
            user = user[0];
            if(!user) return res.status(401).json({success: false, message: "An error occurred: ", err: "Incorrect username or password." });

            //incorrect password
            if(!bcrypt.compareSync(req.body.password, user.password)){
                return res.status(401).json({success: false, message: "An error occured: ", err: "Incorrect username or password."});
            }

            if(user.verified !== 1){
                return res.status(401).json({success: false, message: "An error occured: ", err: "Please verify your account."})
            }

            var user = {
                id: user.id,
                username: user.username,
                profilePicture: user.profile_picture
            }
            var token = jwt.sign(JSON.stringify(user), process.env.SECRET);
            res.status(200).json({success: true, user, token});
        }
    )
}

exports.signup = function(req, res){
    var verificationToken = uuid();

    global.DB.query(
        "INSERT INTO users (username, email, password, verification_token) VALUES (?, ?, ?, ?)",
        [req.body.username, req.body.email, bcrypt.hashSync(req.body.password, 10), verificationToken],
        function(err, result){
            //server error
            if(err) return res.status(500).json({success: false, message: "An error occurred", err});

            //send authentication email and success message
            var verificationLink = "http://chatrbox-api.fr.openode.io/auth/verify?token=" + verificationToken;
            var email = {
                to: req.body.email,
                from: "tivialvarez@gmail.com",
                text: "Please visit the following link to activate your account: " + verificationLink,
                subject: "Verify your account"
            };

            global.MAIL.send(email, function(err, result){
                if(err) return console.log(err);
            });

            res.status(200).json({success: true, message: "Signup successful! Please check your email to verify your account."});
        }
    )
}

exports.verify = function(req, res){
    if(!req.query.token) return res.status(403).json({success: false, message: "Invalid verification token."});

    global.DB.query("SELECT * FROM users where verification_token = ?",
    [req.query.token],
    function(err, user){
        //server error
        if(err) return res.status(500).json({success: false, err});
        
        //no user with matching token found
        if(!user[0]) return res.status(403).json({success: false, message: "Invalid verification token."});

        if(user[0].verified === 1) return res.status(403).json({success: false, message: "Account already verified."});

        global.DB.query("UPDATE users SET verified = 1 WHERE verification_token = ?",
        [req.query.token],
        function(err, result){
            //server error
            if(err) return res.status(500).json({success: false, err});
            
            res.status(201).json({success: true, message: "Your account was verified! You can now log in."});
        });
        
    });
}

module.exports = exports;