const express = require("express");
const router = express.Router();

const {
    subscribeNewsletter,
    getAllSubscribers,
    unsubscribeNewsletter,
} = require("../controller/newsletterController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/newsletter/subscribe").post(subscribeNewsletter);
router.route("/newsletter/unsubscribe").post(unsubscribeNewsletter);

// Admin route
router
    .route("/admin/newsletter/subscribers")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllSubscribers);

module.exports = router;

