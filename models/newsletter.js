const mongoose = require("mongoose");
const validator = require("validator");

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email address"],
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Newsletter", newsletterSchema);

