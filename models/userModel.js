const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    gmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },

  { timestamps: true }
);

module.exports = mongoose.model("user", userModel);

// corrections
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     username: { type: String, required: true, unique: true, trim: true },
//     gmail: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true,
//       match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation regex
//     },
//     password: { type: String, required: true, minlength: 6 }, // Enforces a min length
//   },
//   { timestamps: true } // Auto-adds createdAt and updatedAt fields
// );

// module.exports = mongoose.model("User", userSchema); // Model name capitalized
