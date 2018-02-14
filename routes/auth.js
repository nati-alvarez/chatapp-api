const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth");
const jwtAuthMiddleware = require("../middleware/jwtAuth");

router.post("/login", controller.login);
router.post("/signup", controller.signup);
router.get("/verify", controller.verify);


module.exports = router;