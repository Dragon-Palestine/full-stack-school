const express = require("express");
const router = express.Router();

const logoutController = require("../../controller/sidBar/logout");

router.get('/logout',logoutController.getLink);
module.exports = router;
