const Newsletter = require("../models/newsletter");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendEmail = require("../utils/sendEmail");

// Subscribe to newsletter   =>  /api/v1/newsletter/subscribe
exports.subscribeNewsletter = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandler("Please enter your email address", 400));
    }

    // Check if email already subscribed
    const existingSubscriber = await Newsletter.findOne({ email });

    if (existingSubscriber) {
        return next(new ErrorHandler("This email is already subscribed", 400));
    }

    // Create new subscriber
    const subscriber = await Newsletter.create({ email });

    // Send welcome email
    try {
        const welcomeMessage = `
Hello!

Thank you for subscribing to THE OPTIMAL NEWSLETTER!

You'll now receive the latest news, updates, and exclusive offers from ShopX.

Stay tuned for exciting updates!

Best regards,
ShopX Team
        `;

        await sendEmail({
            email: email,
            subject: "Welcome to THE OPTIMAL NEWSLETTER",
            message: welcomeMessage,
        });
    } catch (emailError) {
        // Log but don't fail the subscription if email fails
        console.error("Failed to send welcome email:", emailError);
    }

    res.status(200).json({
        success: true,
        message: "Successfully subscribed to newsletter!",
    });
});

// Get all newsletter subscribers (Admin)   =>  /api/v1/admin/newsletter/subscribers
exports.getAllSubscribers = catchAsyncErrors(async (req, res, next) => {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });

    res.status(200).json({
        success: true,
        count: subscribers.length,
        subscribers,
    });
});

// Unsubscribe from newsletter   =>  /api/v1/newsletter/unsubscribe
exports.unsubscribeNewsletter = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandler("Please enter your email address", 400));
    }

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
        return next(new ErrorHandler("Email not found in our newsletter list", 404));
    }

    await Newsletter.findByIdAndDelete(subscriber._id);

    res.status(200).json({
        success: true,
        message: "Successfully unsubscribed from newsletter",
    });
});

