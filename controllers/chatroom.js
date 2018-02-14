const fs = require("fs");

exports.getChatroom = function(req, res){
    //check if friendship exists between the users
    global.DB.execute("SELECT identifier FROM friendships WHERE identifier = ? AND status = 1 AND sender_id = ? OR recipient_id = ? AND status = 1",
    [req.params.chatroom, req.user.id, req.user.id],
    function(err, result){
        var chatroom = result[0];
        if(err) return res.status(500).json({success: false, message: "An error occurred", err});

        if(!result[0]) return res.status(403).json({success: false, message: "An error occurred", err: "You are not allowed to chat with this user."});
        
        //if friendships was found get chatlog and return messages as json data
        //if this is the first time users are chatting, create chatlog
        var chatlogFilename = `chatlogs/chatlog-${chatroom.identifier}.json`;
        if(!fs.existsSync(chatlogFilename)){
            fs.writeFile(chatlogFilename, "[]", function(err){
                if(err) return res.status(500).json({success: false, message: "An error occurred", err});
            });
            return res.status(201).json({success: true, message: "Chatroom created!", chatroomMessages: []});
        }

        fs.readFile(chatlogFilename, {encoding: "utf-8"}, function(err, data){
            if(err) return res.status(500).json({success: false, message: "An error occurred", err});
            data = JSON.parse(data);
            return res.status(200).json({success: true, message: "Your messages were found", chatroomMessages: data});
        });
    });
}

exports.sendMessage = function(req, res){
    var chatlogFilename = `chatlogs/chatlog-${req.params.chatroom}.json`;
    var message = {
        body: req.body.messageBody,
        user: req.body.id
    }

    var messages = JSON.parse(fs.readFileSync(chatlogFilename, {encoding: 'utf-8'}))

    messages.push(message);
    
    fs.writeFile(chatlogFilename, JSON.stringify(messages), {encoding: 'utf-8'}, function(err){
        if(err) return res.status(500).json({success: false, message: "An error occurred", err});
    });

    res.status(201).json({success: true, message: "Your message was sent!"});
    

}

module.exports = exports;