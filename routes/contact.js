const express = require("express");
const router = express.Router();

const { sendContactMessage } = require("../controller/contactController");

router.route("/contact").post(sendContactMessage);

module.exports = router;

