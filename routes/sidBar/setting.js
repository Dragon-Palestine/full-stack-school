const express = require("express");
const router = express.Router();

const settingController = require("../../controller/sidBar/setting");

router.get("/setting", settingController.getSettingPage);
router.post("/setting", settingController.postSettingPage);

module.exports = router;
