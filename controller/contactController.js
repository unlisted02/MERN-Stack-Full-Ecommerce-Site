const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendEmail = require("../utils/sendEmail");

// Send contact form message   =>  /api/v1/contact
exports.sendContactMessage = catchAsyncErrors(async (req, res, next) => {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return next(new ErrorHandler("Please fill in all fields", 400));
    }

    // Email to admin
    const adminMessage = `
New Contact Form Submission

Name: ${name}
Email: ${email}

Message:
${message}

---
This message was sent from the ShopX contact form.
    `;

    try {
        // Send email to admin (using SMTP_FROM_EMAIL as recipient for now)
        // You can change this to a dedicated admin email in .env
        await sendEmail({
            email: process.env.SMTP_FROM_EMAIL || process.env.SMTP_EMAIL,
            subject: `New Contact Form Message from ${name}`,
            message: adminMessage,
        });

        // Optional: Send confirmation email to user
        const userMessage = `
Hello ${name},

Thank you for contacting ShopX! We have received your message and will get back to you within one business day.

Your message:
${message}

Best regards,
ShopX Team
        `;

        try {
            await sendEmail({
                email: email,
                subject: "Thank you for contacting ShopX",
                message: userMessage,
            });
        } catch (userEmailError) {
            // Log but don't fail the request if user confirmation email fails
            console.error("Failed to send user confirmation email:", userEmailError);
        }

        res.status(200).json({
            success: true,
            message: "Your message has been sent successfully!",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

