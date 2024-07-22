const mongoose = require("mongoose");

const openingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Applicant",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  requirements: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  joblink: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Opening", openingSchema);
