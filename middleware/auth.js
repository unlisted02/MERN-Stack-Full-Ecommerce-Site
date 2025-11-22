const User = require("../models/user");

const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

// Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Login first to access this resource.", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  
  // Update lastActive timestamp periodically (only if more than 30 minutes have passed)
  // This tracks session activity without constantly updating to "now"
  if (req.user) {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    // Only update if lastActive is older than 30 minutes to reflect actual session activity
    if (!req.user.lastActive || req.user.lastActive < thirtyMinutesAgo) {
      // Use updateOne to avoid fetching the full user document again
      await User.updateOne(
        { _id: req.user._id },
        { lastActive: new Date() },
        { runValidators: false }
      );
      // Update req.user object so the updated timestamp is available in this request
      req.user.lastActive = new Date();
    }
  }
  
  next();
});

// Handling users roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to acccess this resource`,
          403
        )
      );
    }
    next();
  };
};
