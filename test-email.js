// Quick test script to verify email configuration
require("dotenv").config();
const sendEmail = require("./utils/sendEmail");

(async () => {
    console.log("Testing email configuration...\n");
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_PORT:", process.env.SMTP_PORT);
    console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);
    console.log("SMTP_PASSWORD length:", process.env.SMTP_PASSWORD?.replace(/\s/g, "").length || 0);
    console.log("\nAttempting to send test email...\n");

    try {
        await sendEmail({
            email: process.env.SMTP_EMAIL, // Send to yourself
            subject: "Test Email from ShopX",
            message: "This is a test email. If you receive this, your email configuration is working!",
        });
        console.log("\n✅ SUCCESS! Email sent successfully!");
        console.log("Check your inbox:", process.env.SMTP_EMAIL);
    } catch (error) {
        console.error("\n❌ ERROR:", error.message);
        process.exit(1);
    }
})();

