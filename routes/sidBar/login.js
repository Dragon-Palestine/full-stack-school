const express = require("express");
const router = express.Router();

const loginController = require("../../controller/sidBar/login");

router.get("/", loginController.getLoginPage);
router.post("/", loginController.postLoginPage);

module.exports = router;
