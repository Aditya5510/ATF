import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

import CandidateTable from "../component/CandidateTable";
import AnalyticsCharts from "../component/AnalyticsCharts";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/job/${jobId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
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
    };

    fetchJobDetails();
  }, [jobId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!job) return <div>No job found</div>;

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <Header job={job} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <JobOverview job={job} />
            <CandidateTable candidates={job.applicants} />
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

const Header = ({ job }) => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white shadow-md mt-16"
  >
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
      <p className="text-xl text-indigo-600">{job.company}</p>
      <p className="text-gray-600">{job.location}</p>
    </div>
  </motion.div>
);

const JobOverview = ({ job }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md rounded-lg p-6 mb-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Job Overview</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            job.isOpen
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {job.isOpen ? "Open" : "Closed"}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{job.description}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Salary</p>
          <p className="text-xl font-semibold">{job.salary}</p>
        </div>
        <div>
          <p className="text-gray-600">Deadline</p>
          <p className="text-xl font-semibold">
            {new Date(job.deadline).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Total Applicants</p>
          <p className="text-xl font-semibold">{job.totalApplicants}</p>
        </div>
        <div>
          <p className="text-gray-600">Shortlisted</p>
          <p className="text-xl font-semibold">{job.shortlistedApplicants}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-600">Requirements</p>
        <p className="text-gray-800">{job.requirements}</p>
      </div>
      <div className="mt-4">
        <a
          href={job.joblink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800"
        >
          Apply Link
        </a>
      </div>
    </motion.div>
  );
};

export const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-100 pt-16 rounded-md">
    <main className="container mx-auto px-4 py-8">{children}</main>
  </div>
);

export default JobDetailsPage;
