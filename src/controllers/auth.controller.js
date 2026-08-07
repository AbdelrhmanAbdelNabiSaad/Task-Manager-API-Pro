const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const config = require("../config/env");
const AppError = require("../utils/AppError");
const sendEmail = require("../services/email.service");

const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
  });

  if (!newUser) {
    throw new AppError("Please enter data (name,email,password)", 400);
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");

  // const verifyURL = `${config.baseUrl.replace(/\/+$/, '')}/api/auth/verify-email/${verificationToken}`;

  const baseUrl = config.baseUrl || `${req.protocol}://${req.get("host")}`;
  const verifyURL = `${baseUrl.replace(/\/+$/, "")}/api/auth/verify-email/${verificationToken}`;

  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  newUser.emailVerificationToken = hashedToken;

  newUser.emailVerificationExpires = Date.now() + 60 * 60 * 1000;

  await newUser.save({
    validateBeforeSave: false,
  });

  console.log("\n========================================");
  console.log("✅ COPY THIS RAW TOKEN ONLY (not the DB hash):");
  console.log(verificationToken);
  console.log("Full link:", verifyURL);
  console.log("For email:", newUser.email);
  console.log("========================================\n");

  try {
    await sendEmail({
      email: newUser.email,
      subject: "Verify Your Email",
      html: `
                <h2>Welcome ${newUser.name}</h2>
                <p>Please verify your email bt clicking the link below:</p>
                <a href=${verifyURL}>Verify Email</a>
            `,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error.message);
  }

  newUser.password = undefined;

  return res.status(201).json({
    success: true,
    message:
      "Registration successful. Please check your email to verify your account.",
    data: newUser,
    verificationToken: verificationToken,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isVerified) {
    throw new AppError("Please verify your Email first.", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  const token = jwt.sign(
    {
      id: user._id,
    },
    config.jwt_secret,
    {
      expiresIn: "7d",
    },
  );

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  return res.status(200).json({
    success: true,
    message: "Login Successfully.",
    token,
  });
};

const verifyEmail = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log("🔍 Received token from URL:", JSON.stringify(req.params.token));
  console.log("🔍 Computed hash:", hashedToken);

  const userWithToken = await User.findOne({
    emailVerificationToken: hashedToken,
  });
  console.log(
    "🔍 User with this exact token exists (ignoring expiry)?",
    !!userWithToken,
  );
  if (userWithToken) {
    console.log(
      "🔍 Its expiry:",
      userWithToken.emailVerificationExpires,
      "| Now:",
      new Date(),
    );
  }

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: {
      $gt: new Date(),
    },
  });

  if (!user) {
    throw new AppError("Invalid or expired verification token.", 400);
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Email verified successfully.",
  });
};

const getProfile = async (req, res) => {
  return res.status(200).json({
    success: false,
    message: "Data User",
    data: req.user,
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = hashedToken;

  user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetURL = `${config.baseUrl}/api/auth/reset-password/${resetToken}`;

  console.log("\n========================================");
  console.log("✅ COPY THIS RAW TOKEN ONLY (not the DB hash):");
  console.log(resetToken);
  console.log("Full link:", resetURL);
  console.log("For email:", user.email);
  console.log("========================================\n");

  await sendEmail({
    email: user.email,
    subject: "Reset Your Password",
    html: `
        <h2>Hello ${user.name}</h2>
        <p>Click the link below to reset your password</p>
        <a href="${resetURL}">Reset Password</a>
        `,
  });

  return res.status(200).json({
    success: true,
    message: "Password Reset Link Send Successfully",
    resetToken,
  });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  console.log(`reset Password: ${token}`);
  console.log(`Hashed Token: ${hashedToken}`);

  const user = await User.findOne({
    passwordResetToken: hashedToken,

    passwordResetExpires: {
      $gt: Date.now(),
    },
  });
  console.log(user);

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  user.password = req.body.password;

  user.passwordResetToken = null;

  user.passwordResetExpires = null;

  user.refreshToken = null;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password reset successfully.",
  });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new AppError("Current Password is inCorrect", 401);
  }

  if (currentPassword === newPassword) {
    throw new AppError(
      "New Password must be different from current password",
      400,
    );
  }

  user.password = newPassword;
  user.refreshToken = null;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully.",
  });
};

const logout = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.refreshToken = null;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

module.exports = {
  register,
  login,
  verifyEmail,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
};
