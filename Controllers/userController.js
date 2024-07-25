const userSchema = require("../db/schema/userSchema");
const openingSchema = require("../db/schema/openingSchema");
const applicantSchema = require("../db/schema/applicantSchema");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const secretKey = process.env.SECRET_KEY;

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
    const user = await userSchema.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

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
    const joblink = `${process.env.BASE_URL}/apply/${newOpening._id}`;

    newOpening.joblink = joblink;

    await newOpening.save();

    user.openings.push(newOpening._id);
    await user.save();

    return res.status(201).json({
      message: "ok",
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
          .select("name email -_id ATS")
          .lean();

        const applicantsWithAts = applicants.map((applicant, index) => ({
          id: index + 1,
          ...applicant,
          atsScore: applicant.ATS,
        }));

        return {
          id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          deadline: job.deadline.toISOString().split("T")[0],
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

  jobId = new mongoose.Types.ObjectId(jobId);

  openingSchema
    .findById(jobId)
    .then((job) => {
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      const formattedJob = {
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        deadline: job.deadline.toISOString().split("T")[0],
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

const compOpening = async (req, res) => {
  let { jobId } = req.params;

  // console.log(jobId);

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: "Invalid job ID format" });
  }

  jobId = new mongoose.Types.ObjectId(jobId);

  try {
    const opening = await openingSchema.findById(jobId).lean();

    if (!opening) {
      return res.status(404).json({ message: "Job opening not found" });
    }

    const applicants = await applicantSchema.find({ opening: jobId }).lean();

    const response = {
      ...opening,
      applicants: applicants.map((applicant) => ({
        id: applicant._id,
        name: applicant.name,
        email: applicant.email,
        college: applicant.college,
        degree: applicant.degree,
        cgpa: applicant.cgpa,
        status: applicant.status,
        atsScore: applicant.ATS,
      })),
    };

    response.totalApplicants = applicants.length;
    response.shortlistedApplicants = applicants.filter(
      (a) => a.status === "Shortlisted"
    ).length;

    res.json(response);
  } catch (error) {
    console.error("Error fetching job details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const toggleJobStatus = async (req, res) => {
  let { jobId } = req.params;
  const { isOpen } = req.body;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: "Invalid job ID format" });
  }

  jobId = new mongoose.Types.ObjectId(jobId);

  try {
    const updatedJob = await openingSchema.findByIdAndUpdate(
      jobId,
      { isOpen },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({
      message: "ok",
    });
  } catch (error) {
    console.error("Error updating job status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const toggleJobSelect = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { status } = req.body;

    if (status !== "Applied" && status !== "Shortlisted") {
      return res.status(400).json({
        message: 'Invalid status. Must be either "Applied" or "Shortlisted".',
      });
    }

    const updatedCandidate = await applicantSchema.findByIdAndUpdate(
      candidateId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const job = await openingSchema.findOne({ applicants: candidateId });

    if (!job) {
      return res.status(404).json({ message: "Associated job not found" });
    }

    if (status === "Shortlisted") {
      job.shortlistedApplicants = (job.shortlistedApplicants || 0) + 1;
    } else if (status === "Applied" && job.shortlistedApplicants > 0) {
      job.shortlistedApplicants -= 1;
    }

    await job.save();

    res.json({
      message: "Candidate status updated successfully",
    });
  } catch (error) {
    console.error("Error in toggleJobSelect:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const { normalizedEmail } = req.body;

    const user = await userSchema
      .findOne({ email: normalizedEmail })
      .populate("openings");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const activeJobs = user.openings.filter((opening) => opening.isOpen).length;
    const totalCandidates = await applicantSchema.countDocuments({
      opening: { $in: user.openings.map((o) => o._id) },
    });

    const shortlistedApplicants = await applicantSchema.countDocuments({
      opening: { $in: user.openings.map((o) => o._id) },
      status: "Shortlisted",
    });

    const allApplicants = await applicantSchema.find({
      opening: { $in: user.openings.map((o) => o._id) },
    });

    let avgATSScore = 0;
    if (allApplicants.length > 0) {
      avgATSScore =
        allApplicants.reduce(
          (sum, applicant) => sum + parseFloat(applicant.ATS),
          0
        ) / allApplicants.length;
    }

    const interviewsScheduled = shortlistedApplicants;

    const dashboardData = {
      stats: [
        { label: "Active Jobs", value: activeJobs },
        { label: "Total Candidates", value: totalCandidates },
        { label: "Interviews Scheduled", value: interviewsScheduled },
        { label: "Avg. ATS Score", value: `${avgATSScore.toFixed(2)}%` },
      ],
      totalApplicants: totalCandidates,
      shortlistedApplicants: shortlistedApplicants,
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};

module.exports = {
  register,
  createOpening,
  getUserJobs,
  getOpening,
  compOpening,
  toggleJobStatus,
  toggleJobSelect,
  getDashboardData,
};
