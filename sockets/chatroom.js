const fs = require("fs");

var chatroomWatcher = global.IO.of("ws-chatroom");

//check chatroom chatlog for new messages periodically
chatroomWatcher.on('connect', function(socket){

    socket.on("getNewMessages", function(data){
        var chatroomFileName = `chatlogs/chatlog-${data.chatroom}.json`;
        var newMessages = JSON.parse(fs.readFileSync(chatroomFileName, {encoding: "utf-8"}));

        if(newMessages.length !== data.messages.length){
            chatroomWatcher.to(socket.id).emit("returnNewMessages", newMessages);
        }
    });
});