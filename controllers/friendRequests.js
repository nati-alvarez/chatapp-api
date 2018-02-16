exports.getFriendRequests = function(req, res){
    var friendRequests = [];

    global.DB.query("SELECT users.username, users.id AS user_id, users.profile_picture, friendships.status, friendships.id, friendships.sender_id, friendships.recipient_id FROM friendships, users WHERE friendships.recipient_id = ? AND users.id = friendships.sender_id AND status = 0",
    [req.user.id],
    function(err, result){
        if(err) return res.status(500).json({success: false, message: "An error occurred", err});
       
        var friendRequests = [];

        //resturcturing sql data into a more api-friendly format
        for(let i = 0; i < result.length; i++){
            var user = {
                id: result[i].user_id,
                username: result[i].username,
                profilePicture: result[i].profile_picture
            }
            var friendRequest = {
                id: result[i].id,
                senderId: result[i].sender_id,
                recipientId: result[i].recipient_id,
                status: result[i].status,
                sender: user,
            }
            friendRequests.push(friendRequest);
        }

        res.status(200).json({success: true, friendRequests});

    });  
}

//TODO: add socket.io functionality
exports.sendFriendRequest = function(req, res){
    //this value will be used to prevent duplicate friend requests
    //it is both the users ids contcantenated but with the smallest id preceding the greatest seperated by a "-"
    var identifier = (req.user.id < req.body.recipientId)? `${req.user.id}-${req.body.recipientId}`: `${req.body.recipientId}-${req.user.id}`;
    console.log(identifier);

    //forever alone ECKS DEEE XD LMAO
    if(req.user.id == req.body.recipientId) return res.status(406).json({success: false, message: "You can't friend yourself loser."})
    
    global.DB.query("INSERT INTO friendships (sender_id, recipient_id, identifier) VALUES (?, ?, ?)",
    [req.user.id, req.body.recipientId, identifier],
    function(err, result){
        if(err) return res.status(500).json({success: false, message: "An error occurred", err});

        res.status(201).json({success: true, message: "Friend request sent."});
    });
}

exports.acceptFriendRequest = function(req, res){
    global.DB.query("UPDATE friendships SET status = 1 WHERE id = ? AND recipient_id = ?",
    [req.params.id, req.user.id],
    function(err, result){
        if(err) return res.status(500).json({success: false, message: "An error occurred.", err});
        if(result.affectedRows < 1) return res.status(404).json({success: false, message: "Request not found."});
        res.status(203).json({success: true, message: "Friend request accepted."});
    });
}

exports.declineFriendRequest = function(req, res){
    global.DB.query("DELETE from friendships WHERE id = ? AND recipient_id = ?",
    [req.params.id, req.user.id],
    function(err, result){
        if(err) return res.status(500).json({success: false, message: "An error occurred.", err});
        if(result.affectedRows < 1) return res.status(404).json({success: false, message: "Request not found."});
        res.status(203).json({success: true, message: "Friend request declined."});
    });
}

module.exports = exports;