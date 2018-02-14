const express = require("express");
const router = express.Router();

const controller = require("../controllers/friends");
const jwtAuthMiddleware = require("../middleware/jwtAuth");

router.get("/", jwtAuthMiddleware, controller.getAllOnlineFriends);

module.exports = router;