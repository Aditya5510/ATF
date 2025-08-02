import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Spinner from "../component/Spinner";

import { Link } from "react-router-dom";

const jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    const token = localStorage.getItem("token");
    // console.log(token);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/getOpenings`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        setLoading(false);
      }
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
          Your Job Postings
        </h1>
        {jobs?.length === 0 && (
          <p className="text-center text-lg text-gray-600">
            You have not posted any jobs yet.
          </p>
        )}

        {loading === false ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewApplicants={() => setSelectedJob(job)}
                />
              ))}
            </div>

            <AnimatePresence>
              {selectedJob && (
                <JobModal
                  job={selectedJob}
                  onClose={() => setSelectedJob(null)}
                />
              )}
            </AnimatePresence>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center h-[60vh] w-full">
              <Spinner color="blue" thickness={4} size={40} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
const JobCard = ({ job, onViewApplicants }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
    >
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {job.title}
          </h2>
          <Link
            to={`/job/${job.id}`}
            className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full hover:bg-yellow-600 transition duration-300"
          >
            Details
          </Link>
        </div>
        <p className="text-indigo-600 font-medium mb-1">{job.company}</p>
        <p className="text-sm text-gray-600 mb-4">{job.location}</p>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-4"
            >
              <div className="max-h-40 overflow-y-auto text-sm text-gray-700">
                <p>{job.description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              job.isOpen
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {job.isOpen ? "Open" : "Closed"}
          </span>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleExpansion}
              className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded-md hover:bg-gray-300 transition duration-300"
            >
              {isExpanded ? "Hide Details" : "Show Details"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewApplicants}
              className="bg-indigo-500 text-white px-3 py-1 text-sm rounded-md hover:bg-indigo-600 transition duration-300"
            >
              View Applicants
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const JobModal = ({ job, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-gray-800">
            {job.title}
          </h2>
          <p className="text-lg sm:text-xl text-indigo-600 mb-1 sm:mb-2">
            {job.company}
          </p>
          <p className="text-gray-600 mb-2 sm:mb-4">{job.location}</p>
          <div className="mb-4 max-h-60 overflow-y-auto">
            <p className="text-gray-800 text-sm sm:text-base">
              {job.description}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <p className="font-semibold">Deadline</p>
              <p className="text-sm sm:text-base">{job.deadline}</p>
            </div>
            <div>
              <p className="font-semibold">Status</p>
              <p className="text-sm sm:text-base">
                {job.isOpen ? "Open" : "Closed"}
              </p>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <p className="font-semibold">Application Link</p>

              <a
                href={job.joblink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm sm:text-base break-all"
              >
                {job.joblink}
              </a>
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">
            Applicants
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ATS Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {job.applicants.map((applicant) => (
                  <tr key={applicant.id}>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm">
                      {applicant.name}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm">
                      {applicant.email}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm">
                      {applicant.atsScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:text-sm"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default jobs;
