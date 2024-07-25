require("dotenv").config();
const userSchema = require("../db/schema/userSchema");
const openingSchema = require("../db/schema/openingSchema");
const applicantSchema = require("../db/schema/applicantSchema");
const { initializeGenAI, performATSCalculation } = require("../Gemini/gen");
const mongoose = require("mongoose");

const genAI = initializeGenAI(process.env.API_KEY);

const isDeadlinePassed = (deadline) => {
  const now = new Date();
  return now > new Date(deadline);
};

const application = async (req, res) => {
  const { id: openingId } = req.params;
  const { name, email, college, degree, cgpa, resumeText, letter } = req.body;

  //   console.log(process.env.API_KEY);

  try {
    openId = new mongoose.Types.ObjectId(openingId);
    const opening = await openingSchema.findById(openingId);
    if (!opening) {
      return res.status(404).json({ message: "Job opening not found" });
    }

    if (!opening.isOpen) {
      return res.status(400).json({
        message: "This job opening is no longer accepting applications",
      });
    }
    if (isDeadlinePassed(opening.deadline)) {
      return res.status(400).json({
        message: "The deadline for this job opening has passed",
      });
    }

    if (!name || !email || !college || !degree || !resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingApplication = await applicantSchema.findOne({
      email,
      opening: openingId,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    //  Perform ATS calculation
    const { score: atsScore } = await performATSCalculation(
      genAI,
      opening.description,
      resumeText
    );

    const newApplicant = new applicantSchema({
      name,
      email,
      college,
      degree,
      cgpa,
      resume: resumeText,
      letter,
      opening: openingId,
      ATS: atsScore,
    });

    await newApplicant.save();
    opening.applicants.push(newApplicant._id);
    await opening.save();

    res.status(201).json({ message: "ok" });
  } catch (error) {
    console.error("Error in job application process:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your application" });
  }
};

module.exports = { application };
