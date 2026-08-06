const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [3, "Name must be at least 3 characters."],
      maxlength: [50, "Name must not exceed 50 characters."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/,
        "Please enter a valid email address.",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters."],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      ],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "Role must be either user or admin.",
      },
      default: "user",
    },
    passwordResetToken: {
      type: String,
      default: null
    },
    passwordResetExpires: {
      type: Date,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null
    },
    emailVerificationExpires: {
      type: Date,
      default: null
    },
  },
  {
    timestamps: true,
  },
);

userSchema.virtual('confirmPassword')
  .get(function () {
    return this._confirmPassword;
  })
  .set(function (value) {
    this._confirmPassword = value;
  });

userSchema.pre('validate', function () {
  // Only check confirmPassword on new user creation (register).
  // It is never persisted, so it must not be required on later saves
  // (e.g. verify-email, profile updates).
  if (this.isNew) {
    if (!this._confirmPassword) {
      this.invalidate('confirmPassword', 'Confirm password is required');
    } else if (this._confirmPassword !== this.password) {
      this.invalidate('confirmPassword', 'Passwords do not match');
    }
  }

});

userSchema.pre('save', async function () {

    if(!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);

})

const User = mongoose.model("User", userSchema);

module.exports = User;
