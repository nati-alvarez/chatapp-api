exports.getUsers = function(req, res){
    //optional username filter for search results
    var query = (req.query.username)? req.query.username + "%": "%";

    global.DB.execute("SELECT id, username, profile_picture from users WHERE username LIKE ? AND username != ?",
    [query, req.user.username],
    function(err, users){
        if(err) return res.status(500).json({success: false, message: "An error occurred", err});

        res.status(200).json({success: true, users});
    });
}

exports.getUser = function(req, res){
    var query = req.params.username;
    
    global.DB.execute("SELECT id, username, profile_picture from users WHERE username = ?",
    [query],
    function(err, user){
        if(err) return res.status(500).json({success: false, message: "An error occurred", err});
        if(!user[0]) return res.status(200).json({success: false, message: "User not found."});
        res.status(200).json({success: true, user: user[0]});
    });
}

exports.udpateUser = function(req, res){
    console.log(req.user, req.params)
    //check if current logged in user matches the account being deleted
    if(req.user.username !== req.params.username) return res.status(403).json({success: false, message: "This is not your account. You are not authorized to modify it"});

    var newProfilePicture = req.body.profilePicture || req.user.profilePicture;
    var newUsername = req.body.username || req.user.username
    global.DB.execute("UPDATE users SET profile_picture = ?, username = ? WHERE username = ?",
    [newProfilePicture, newUsername, req.params.username],
    function(err, result){
        if(err) return res.status(500).json({success: false, message: "An error occurred", err});

        res.status(201).json({success: true, message: "Your account was successfully updated."});
    })
}

exports.deleteUser = function(req, res){
    //check if current logged in user matches the account being deleted
    if(!req.authorized) return res.status(403).json({success: false, message: "You are not authorized to perform this action."});

    global.DB.execute("DELETE from users WHERE username = ?",
    [req.params.username],
    function(err, result){
        if(err) return res.status(500).json({success: false, message: "An error occurred", err});
        res.status(200).json({success: true, message: "Your account was deleted successfully"});
    });
}

module.exports = exports;