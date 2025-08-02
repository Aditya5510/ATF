import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import CandidateTable from "../component/CandidateTable";
import AnalyticsCharts from "../component/AnalyticsCharts";
// import { toast } from "react-toastify";
import toast from "react-hot-toast";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullRequirements, setShowFullRequirements] = useState(false);

  const fetchJobDetails = React.useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/job/${jobId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setJob(data);
    } catch (err) {
      setError("Failed to fetch job details");
      console.error("Error fetching job details:", err);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const toggleJobStatus = async () => {
    const originalStatus = job.isOpen;

    setJob((prevJob) => ({ ...prevJob, isOpen: !prevJob.isOpen }));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/job/${jobId}/toggle-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
          body: JSON.stringify({ isOpen: !originalStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success(
        `Job status updated to ${!originalStatus ? "Open" : "Closed"}`
      );
    } catch (err) {
      console.error("Error updating job status:", err);
      setJob((prevJob) => ({ ...prevJob, isOpen: originalStatus }));
      toast.error("Failed to update job status. Please try again.");
    }
  };

  const handleCandidateStatusChange = React.useCallback(async () => {
    await fetchJobDetails();
  }, [fetchJobDetails]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error: {error}
      </div>
    );
  if (!job)
    return (
      <div className="flex justify-center items-center h-screen">
        No job found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 mt-16">
      <Header job={job} toggleJobStatus={toggleJobStatus} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {" "}
            <JobOverview
              job={job}
              showFullDescription={showFullDescription}
              setShowFullDescription={setShowFullDescription}
              showFullRequirements={showFullRequirements}
              setShowFullRequirements={setShowFullRequirements}
            />
            <div className="mt-8">
              {" "}
              <CandidateTable
                candidates={job.applicants}
                onStatusChange={handleCandidateStatusChange}
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <AnalyticsCharts
              totalApplicants={job.totalApplicants}
              shortlistedApplicants={job.shortlistedApplicants}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const Header = ({ job, toggleJobStatus }) => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
  >
    <div className="container mx-auto px-4 py-6 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <p className="text-xl">{job.company}</p>
        <p className="text-sm">{job.location}</p>
      </div>
      <button
        onClick={toggleJobStatus}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
          job.isOpen
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        {job.isOpen ? "Open" : "Closed"}
      </button>
    </div>
  </motion.div>
);

const JobOverview = ({
  job,
  showFullDescription,
  setShowFullDescription,
  showFullRequirements,
  setShowFullRequirements,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg rounded-lg p-6 mb-8"
    >
      <h2 className="text-2xl font-semibold mb-4">Job Overview</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-100 p-3 rounded">
          <p className="text-gray-600 text-sm">Salary</p>
          <p className="text-lg font-semibold">{job?.salary}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <p className="text-gray-600 text-sm">Deadline</p>
          <p className="text-lg font-semibold">
            {new Date(job.deadline).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <p className="text-gray-600 text-sm">Total Applicants</p>
          <p className="text-lg font-semibold">{job.totalApplicants}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <p className="text-gray-600 text-sm">Shortlisted</p>
          <p className="text-lg font-semibold">{job?.shortlistedApplicants}</p>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Description</h3>
        <p className="text-gray-700">
          {showFullDescription
            ? job?.description
            : `${job?.description.substring(0, 150)}...`}
        </p>
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="text-indigo-600 hover:text-indigo-800 mt-2"
        >
          {showFullDescription ? "Show Less" : "Read More"}
        </button>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Requirements</h3>
        <p className="text-gray-700">
          {showFullRequirements
            ? job?.requirements
            : `${job?.requirements.substring(0, 150)}...`}
        </p>
        <button
          onClick={() => setShowFullRequirements(!showFullRequirements)}
          className="text-indigo-600 hover:text-indigo-800 mt-2"
        >
          {showFullRequirements ? "Show Less" : "Read More"}
        </button>
      </div>

      <a
        href={job?.joblink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300"
      >
        Go to Application Link
      </a>
    </motion.div>
  );
};

export default JobDetailsPage;
