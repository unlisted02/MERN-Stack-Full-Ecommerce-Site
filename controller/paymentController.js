const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// Check if Stripe is enabled
const isStripeEnabled = () => {
    return (
        process.env.STRIPE_SECRET_KEY &&
        process.env.STRIPE_SECRET_KEY !== "sk_test_yourStripeSecret" &&
        process.env.STRIPE_API_KEY &&
        process.env.STRIPE_API_KEY !== "pk_test_yourStripePublishable"
    );
};

const stripe = isStripeEnabled()
    ? require("stripe")(process.env.STRIPE_SECRET_KEY)
    : null;

// Process stripe payments   =>   /api/v1/payment/process
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
    if (!isStripeEnabled() || !stripe) {
        return next(
            new ErrorHandler(
                "Payment processing is currently disabled. Please contact support for manual orders.",
                503
            )
        );
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",

        metadata: { integration_check: "accept_a_payment" },
    });

    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret,
    });
});

// Send stripe API Key   =>   /api/v1/stripeapi
exports.sendStripApi = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({
        stripeApiKey: isStripeEnabled() ? process.env.STRIPE_API_KEY : null,
    });
});
