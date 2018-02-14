const express = require("express");
const router = express.Router();

const controller = require("../controllers/friendRequests");
const jwtAuthMiddleware = require("../middleware/jwtAuth");

router.get("/", jwtAuthMiddleware, controller.getFriendRequests);
router.post("/", jwtAuthMiddleware, controller.sendFriendRequest);
router.post("/accept/:id", jwtAuthMiddleware, controller.acceptFriendRequest);
router.post("/decline/:id", jwtAuthMiddleware, controller.declineFriendRequest);

module.exports = router;