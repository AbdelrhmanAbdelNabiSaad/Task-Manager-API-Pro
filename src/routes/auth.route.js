const express = require("express");
const {
  register,
  login,
  verifyEmail,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
} = require("../controllers/auth.controller");
const router = express.Router();
const protect = require("../middlewares/protect.middleware");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const { body } = require("express-validator");
const validate = require("../middlewares/validate.middleware");
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
} = require("../validations/auth.validator");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: abdelrhmansaad127@gmail.com
 *               password:
 *                 type: string
 *                 example: As123456
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       422:
 *         description: Validation Error
 */
router.post("/login", loginValidation, asyncHandler(login));
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 example: Abdelrhman
 *               email:
 *                 type: string
 *                 example: abdelrhmansaad127@gmail.com
 *               password:
 *                 type: string
 *                 example: As123456
 *               confirmPassword:
 *                 type: string
 *                 example: As123456
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation Error
 */
router.post("/register", registerValidation, asyncHandler(register));
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the authenticated user
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.post('/logout', protect, asyncHandler(logout));
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send password reset link to user's email
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: abdo@gmail.com
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset link sent successfully
 *       404:
 *         description: User not found
 *       422:
 *         description: Validation Error
 *       500:
 *         description: Failed to send reset email
 */
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validate,
  forgotPassword,
);
/**
 * @swagger
 * /auth/reset-password/{token}:
 *   patch:
 *     summary: Reset user password
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */
router.patch(
  "/reset-password/:token",
  resetPasswordValidation,
  validate,
  asyncHandler(resetPassword),
);

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     summary: Change current user password
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: 12345678
 *               newPassword:
 *                 type: string
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Current password is incorrect
 */
router.patch(
  "/change/password",
  protect,
  changePasswordValidation,
  validate,
  asyncHandler(changePassword),
);

/**
 * @swagger
 * /auth/verify-email/{token}:
 *   get:
 *     summary: Verify user email
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired verification token
 */
router.get("/verify-email/:token", asyncHandler(verifyEmail));

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", protect, asyncHandler(getProfile));

module.exports = router;
