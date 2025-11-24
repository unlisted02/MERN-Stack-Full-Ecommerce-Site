const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Configure transporter based on provider
  const isGmail = process.env.SMTP_HOST === "smtp.gmail.com";
  
  // Remove spaces from password (Gmail App Passwords often have spaces for readability)
  const password = (process.env.SMTP_PASSWORD || "").replace(/\s/g, "");
  const email = process.env.SMTP_EMAIL || "";
  
  if (!password) {
    throw new Error("SMTP_PASSWORD is not configured");
  }
  
  if (!email) {
    throw new Error("SMTP_EMAIL is not configured");
  }
  
  // Debug: Log email (but not password for security)
  console.log(`[Email] Attempting to send from: ${email}`);
  console.log(`[Email] Password length: ${password.length} characters`);
  
const resolvedPort = parseInt(process.env.SMTP_PORT, 10) || (isGmail ? 587 : 465);
const transporterConfig = {
    host: process.env.SMTP_HOST,
    port: resolvedPort,
    secure: resolvedPort === 465, // only use SSL when explicitly on port 465
    auth: {
        user: email,
        pass: password, // App Password (spaces automatically removed)
    },
};

  // For Gmail, add TLS options
  if (isGmail) {
    transporterConfig.tls = {
      rejectUnauthorized: false,
    };
  }

  const transporter = nodemailer.createTransport(transporterConfig);

  // Verify connection (optional, helps with debugging)
  try {
    await transporter.verify();
    console.log("[Email] SMTP connection verified successfully");
  } catch (error) {
    console.error("[Email] SMTP connection error:", error.message);
    
    // Provide more helpful error messages
    if (error.message.includes("Invalid login") || error.message.includes("BadCredentials")) {
      throw new Error(
        "Gmail authentication failed. Please verify:\n" +
        "1. Your App Password is correct (16 characters, no spaces)\n" +
        "2. 2-Step Verification is enabled on your Google account\n" +
        "3. The App Password was generated for 'Mail' app\n" +
        "4. You're using the email address associated with the App Password\n" +
        "Original error: " + error.message
      );
    }
    
    throw new Error(`SMTP connection failed: ${error.message}`);
  }

  const message = {
    from: `${process.env.SMTP_FROM_NAME || "ShopX"} <${process.env.SMTP_FROM_EMAIL || email}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message.replace(/\n/g, "<br>"), // Convert newlines to HTML
  };

  await transporter.sendMail(message);
  console.log(`[Email] Message sent successfully to: ${options.email}`);
};

module.exports = sendEmail;
