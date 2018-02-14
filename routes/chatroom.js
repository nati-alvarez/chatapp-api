const express = require("express");
const router = express.Router();

const jwtAuthMiddleware = require("../middleware/jwtAuth");
const controller = require("../controllers/chatroom");

router.get('/:chatroom', jwtAuthMiddleware, controller.getChatroom);
router.post('/:chatroom', jwtAuthMiddleware, controller.sendMessage);

module.exports = router;