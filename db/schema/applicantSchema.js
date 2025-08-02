const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  college: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  cgpa: {
    type: String,
    required: false,
  },

  resume: {
    type: String,
    required: true,
  },
  letter: {
    type: String,
    required: false,
  },
  opening: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Opening",
  },
  date: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
    enum: ["Applied", "Shortlisted", "Accepted", "Rejected"],
    default: "Applied",
  },
  ATS: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Applicant", applicantSchema);
