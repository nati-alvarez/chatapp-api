var friendsWatcher = global.IO.of("ws-friends");

friendsWatcher.on('connection', function(socket){
    //request from client to view all new friends
    socket.on("getFriends", function(data){
        if(!data.user) return;
        getFriends();

        function getFriends() {
            global.DB.execute("SELECT friendships.sender_id, friendships.recipient_id, friendships.status, users.id AS user_id, users.username, users.profile_picture FROM friendships, users WHERE (recipient_id = ? OR sender_id = ?) AND (users.id != ? AND (users.id = friendships.recipient_id OR users.id = friendships.sender_id)) AND status = 1",
            [data.user.id, data.user.id, data.user.id],
            function(err, result){
                //server error
                if(err) return console.log(err);

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
        
                //compare provided friend requests to db results
                if(result.length !== data.friends.length){
                    friendsWatcher.to(socket.id).emit("returnFriends", {new: true, friends});
                }
            });
        }
    });

    socket.on('disconnect', function() {
    });

});

module.exports = friendsWatcher;