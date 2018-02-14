const friendRequestsWatcher  = global.IO.of('friendRequests');

friendRequestsWatcher.on('connection', function(socket){

    //request from client to view all new friend requests
    socket.on('getFriendRequests', function(data){
        if(!data.user) return;
        getFriendRequests();
        function getFriendRequests() {
            global.DB.execute("SELECT users.username, users.id AS user_id, users.profile_picture, friendships.status, friendships.id, friendships.sender_id, friendships.recipient_id FROM friendships, users WHERE friendships.recipient_id = ? AND users.id = friendships.sender_id AND status = 0",
            [data.user.id],
            function(err, result){
                //server error
                if(err) return console.log(err);

                //resturcturing sql data into a more api-friendly format
                var friendRequests = [];

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
        
                //compare provided friend requests to db results
                if(friendRequests.length !== data.friendRequests.length){
                    friendRequestsWatcher.to(socket.id).emit("returnFriendRequests", {new: true, friendRequests});
                }
            });
        }
    });

    socket.on('disconnect', function() {
    });

});

module.exports = friendRequestsWatcher;