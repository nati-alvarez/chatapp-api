const express = require("express");
const router = express.Router();

const jwtAuthMiddleware = require("../middleware/jwtAuth");

const controller = require("../controllers/users");

router.get("/", jwtAuthMiddleware, controller.getUsers);
router.get("/:username", jwtAuthMiddleware, controller.getUser);
router.delete("/:username", jwtAuthMiddleware, controller.deleteUser);
router.put("/:username", jwtAuthMiddleware, controller.udpateUser);

module.exports = router;