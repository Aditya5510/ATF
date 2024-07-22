import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Spinner from "../component/Spinner";

const jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/getOpenings`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
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
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
    >
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          {job.title}
        </h2>
        <p className="text-indigo-600 font-medium mb-1">{job.company}</p>
        <p className="text-gray-600 mb-4">{job.location}</p>
        <div className="flex justify-between items-center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              job.isOpen
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {job.isOpen ? "Open" : "Closed"}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewApplicants}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            View Details
          </motion.button>
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">{job.title}</h2>
          <p className="text-xl text-indigo-600 mb-2">{job.company}</p>
          <p className="text-gray-600 mb-4">{job.location}</p>
          <p className="text-gray-800 mb-4">{job.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-semibold">Deadline</p>
              <p>{job.deadline}</p>
            </div>
            <div>
              <p className="font-semibold">Status</p>
              <p>{job.isOpen ? "Open" : "Closed"}</p>
            </div>
            <div className="col-span-2">
              <p className="font-semibold">Application Link</p>
              <a
                href={job.joblink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {job.joblink}
              </a>
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Applicants</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ATS Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {job.applicants.map((applicant) => (
                  <tr key={applicant.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {applicant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {applicant.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default jobs;
