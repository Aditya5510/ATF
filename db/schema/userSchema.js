const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  clerk_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  openings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opening",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
