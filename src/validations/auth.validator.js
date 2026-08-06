const { body } = require("express-validator");

exports.registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters."),
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address."),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and a number",
    ),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password not match");
      } else {
        return true;
      }
    }),
];

exports.loginValidation = [
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a vliad email address."),
  body("password").notEmpty().withMessage("Password is required"),
];

exports.forgotPasswordValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
];

exports.resetPasswordValidation = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .withMessage("Password must contain uppercase, lowercase and number"),
];

exports.changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current Password is required."),
  body("newPassword")
    .notEmpty()
    .withMessage()
    .isLength({ min: 8 })
    .withMessage("New Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("New Password must be contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("New password must be contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("New password must be contain at least 6 numbers."),
];
