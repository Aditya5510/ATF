// JobPostingForm.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const JobPostingForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    requirements: "",
    deadline: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/opening`,
        {
          method: "POST",
          headers: {
            token: `${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Job posting submitted successfully:", data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting job posting:", error);
    }
  };

  const inputClasses =
    "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500";

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-md rounded-lg p-6 text-center"
      >
        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          Job Posted Successfully!
        </h2>
        <p className="mb-6 text-gray-600">
          Your job posting has been submitted and is now live.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/jobs")}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View Job
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md rounded-lg p-6"
    >
      <h2 className="text-2xl font-semibold mb-4">Post a New Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Job Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700"
            >
              Company
            </label>
            <input
              type="text"
              name="company"
              id="company"
              value={formData.company}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label
              htmlFor="salary"
              className="block text-sm font-medium text-gray-700"
            >
              Salary Range
            </label>
            <input
              type="text"
              name="salary"
              id="salary"
              value={formData.salary}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Job Description
            </label>
            <textarea
              name="description"
              id="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className={inputClasses}
              required
            ></textarea>
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="requirements"
              className="block text-sm font-medium text-gray-700"
            >
              Requirements
            </label>
            <textarea
              name="requirements"
              id="requirements"
              rows="3"
              value={formData.requirements}
              onChange={handleChange}
              className={inputClasses}
              required
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-gray-700"
            >
              Application Deadline
            </label>
            <input
              type="date"
              name="deadline"
              id="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
        </div>
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Post Job
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default JobPostingForm;
