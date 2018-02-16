exports.getAllOnlineFriends = function(req, res){
    global.DB.query("SELECT friendships.sender_id, friendships.recipient_id, friendships.status, users.id AS user_id, users.username, users.profile_picture FROM friendships, users WHERE (recipient_id = ? OR sender_id = ?) AND (users.id != ? AND (users.id = friendships.recipient_id OR users.id = friendships.sender_id)) AND status = 1",
    [req.user.id, req.user.id, req.user.id],
    function(err, result){
        if(err) return res.status(500).json({success: false, message: "An error occurred: ", err});

        //resturcturing sql data into a more api-friendly format
        var friends = [];
        for(let i = 0; i < result.length; i++){
            var user = {
                id: result[i].user_id,
                username: result[i].username,
                profilePicture: result[i].profile_picture
            }
            var friend = {
                id: result[i].id,
                senderId: result[i].sender_id,
                recipientId: result[i].recipient_id,
                status: result[i].status,
                friend: user,
            }
            friends.push(friend);
        }
        
        res.status(200).json({success: true, friends});

    })
}

module.exports = exports;