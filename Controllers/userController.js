const userSchema = require("../db/schema/userSchema");
const openingSchema = require("../db/schema/openingSchema");
const applicantSchema = require("../db/schema/applicantSchema");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const mongoose = require("mongoose");

const register = async (req, res) => {
  try {
    const { name, clerk_id, email } = req.body;

    if (!(name && email && clerk_id)) {
      return res.status(400).json({
        message: "All input is required",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await userSchema.findOne({
      email: normalizedEmail,
    });

    if (!existingUser) {
      const user = new userSchema({
        name,
        clerk_id,
        email: normalizedEmail,
      });
      const newUser = await user.save();
    }

    const token = jwt.sign({ normalizedEmail }, secretKey);

    return res.status(201).json({
      message: "ok",
      token,
    });
  } catch (e) {
    console.log(e);
  }
};

const createOpening = async (req, res) => {
  const {
    title,
    company,
    location,
    salary,
    description,
    requirements,
    deadline,
    normalizedEmail,
  } = req.body;

  try {
    // Find the user by normalized email
    const user = await userSchema.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // const joblink = crypto.randomBytes(10).toString("hex");

    // Create new opening
    const newOpening = new openingSchema({
      title,
      company,
      location,
      salary,
      description,
      requirements,
      deadline: new Date(deadline),
      user: user._id,
      joblink: `www.google.com`,
      isOpen: true,
      date: new Date(),
    });
    const joblink = ` ${process.env.BASE_URL}apply/${newOpening._id}`;

    newOpening.joblink = joblink;

    // Save the opening
    await newOpening.save();

    // Add the opening to the user's openings array
    user.openings.push(newOpening._id);
    await user.save();

    console.log("Opening created successfully");
    return res.status(201).json({
      message: "ok",
      // data: newOpening,
    });
  } catch (error) {
    console.error("Error creating opening:", error);
    return res.status(500).json({
      message: "Error creating opening",
      error: error.message,
    });
  }
};
const getUserJobs = async (req, res) => {
  try {
    const { normalizedEmail } = req.body;

    const user = await userSchema.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const jobs = await openingSchema
      .find({ user: user._id })
      .sort({ date: -1 });

    const formattedJobs = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await applicantSchema
          .find({ opening: job._id })
          .select("name email -_id")
          .lean();

        const applicantsWithAts = applicants.map((applicant, index) => ({
          id: index + 1,
          ...applicant,
          atsScore: Math.floor(Math.random() * 31) + 70, // Random score between 70 and 100
        }));

        return {
          id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          deadline: job.deadline.toISOString().split("T")[0], // Format date as YYYY-MM-DD
          isOpen: job.isOpen,
          joblink: job.joblink,
          applicants: applicantsWithAts,
        };
      })
    );

    res.status(200).json(formattedJobs);
  } catch (error) {
    console.error("Error fetching user jobs:", error);
    res.status(500).json({
      message: "Error fetching jobs",
      error: error.message,
    });
  }
};
const getOpening = (req, res) => {
  let { jobId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: "Invalid job ID format" });
  }

  // Ensure jobId is in ObjectId format
  jobId = new mongoose.Types.ObjectId(jobId);

  openingSchema
    .findById(jobId)
    .then((job) => {
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Transform the data to the required format
      const formattedJob = {
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        deadline: job.deadline.toISOString().split("T")[0], // Format the date to YYYY-MM-DD
        status: job.isOpen ? "Open" : "Closed",
      };

      res.status(200).json(formattedJob);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error fetching job",
        error: err.message,
      });
    });
};

module.exports = { register, createOpening, getUserJobs, getOpening };
