require('dotenv').config()

const express = require("express");
const app = express();
const routes = require("./routes");
const mysql2 = require("mysql2");
const email = require("emailjs");
const bodyParser = require("body-parser");
const cors = require('cors');
const server = require('http').Server(app);
const io = require('socket.io')(server);
global.IO = io;

const friendRequestsSocket = require("./sockets/friendRequests");
const friendsSocket = require("./sockets/friends");
const chatroomSocket = require("./sockets/chatroom");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

var corsOptions = {
    origin: '*',
    credentials: true
}
app.use(cors(corsOptions));

global.MAIL = email.server.connect({
    user:    "tivialvarez@gmail.com", 
    password: process.env.EMAIL_PASS, 
    host:    "smtp.gmail.com", 
    ssl:     true
});

global.DB = mysql2.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "chatapp"
});

app.use("/", routes);

server.listen(80, ()=>console.log("app is listening"));