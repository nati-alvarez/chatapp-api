const express = require("express");
const router = express.Router();
const jwtAuthMiddleware = require("../middleware/jwtAuth");

const authRoutes = require("./auth");
const userRoutes = require("./users");
const friendRequestRoutes = require("./friendRequests");
const friendRoutes = require("./friends");
const chatroomRoutes = require("./chatroom");

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/friend-requests", friendRequestRoutes);
router.use("/friends", friendRoutes);
router.use("/chatroom", chatroomRoutes);


module.exports = router;