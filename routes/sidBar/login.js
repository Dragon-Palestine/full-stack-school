const express = require("express");
const router = express.Router();

const loginController = require("../../controller/sidBar/login");

router.get("/", loginController.getLoginPage);
router.post("/", loginController.postLoginPage);
router.get('/users/show',loginController.getShow);
module.exports = router;
