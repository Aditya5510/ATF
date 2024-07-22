import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";

const CandidateForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);
  const [jobDetails, setJobdetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    degree: "",
    cgpa: "",
    resume: null,
    letter: "",
  });

  const { id } = useParams();
  //   console.log(id);

  //   const jobDetails = {
  //     title: "Software Engineer",
  //     company: "Helix",
  //     location: "Gurugram",
  //     description: "sadnaksjndjaksndkjas",
  //     deadline: "2024-07-17",
  //     status: "Open",
  //   };

  React.useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/jobopening/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setJobdetails(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <motion.div {...fadeIn}>
          <h2 className="text-4xl font-bold text-center text-blue-800 mb-6">
            {jobDetails.title}
          </h2>
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">
              Job Details
            </h3>
            <p className="text-lg text-blue-800 mb-2">
              <span className="font-medium">Company:</span> {jobDetails.company}
            </p>
            <p className="text-lg text-blue-800 mb-2">
              <span className="font-medium">Location:</span>{" "}
              {jobDetails.location}
            </p>
            <p className="text-lg text-blue-800 mb-2">
              <span className="font-medium">Description:</span>{" "}
              {jobDetails.description}
            </p>
            <p className="text-lg text-blue-800 mb-2">
              <span className="font-medium">Deadline:</span>{" "}
              {jobDetails.deadline}
            </p>
            <p className="text-lg text-blue-800">
              <span className="font-medium">Status:</span> {jobDetails.status}
            </p>
          </div>
          {!showForm && (
            <motion.button
              onClick={() => setShowForm(true)}
              className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl hover:bg-blue-700 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Apply Now
            </motion.button>
          )}
        </motion.div>

        {showForm && (
          <motion.form
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
            {...fadeIn}
          >
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" {...fadeIn} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xl font-medium text-blue-900 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-blue-300 rounded-md shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xl font-medium text-blue-900 mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-blue-300 rounded-md shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" {...fadeIn} className="space-y-6">
                  <div>
                    <label
                      htmlFor="college"
                      className="block text-xl font-medium text-blue-900 mb-2"
                    >
                      College
                    </label>
                    <input
                      id="college"
                      name="college"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-blue-300 rounded-md shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.college}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="degree"
                      className="block text-xl font-medium text-blue-900 mb-2"
                    >
                      Degree
                    </label>
                    <input
                      id="degree"
                      name="degree"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-blue-300 rounded-md shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.degree}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cgpa"
                      className="block text-xl font-medium text-blue-900 mb-2"
                    >
                      CGPA
                    </label>
                    <input
                      id="cgpa"
                      name="cgpa"
                      type="text"
                      className="w-full px-4 py-3 border border-blue-300 rounded-md shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.cgpa}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" {...fadeIn} className="space-y-6">
                  <div>
                    <label
                      htmlFor="resume"
                      className="block text-xl font-medium text-blue-900 mb-2"
                    >
                      Resume
                    </label>
                    <input
                      id="resume"
                      name="resume"
                      type="file"
                      required
                      className="w-full px-4 py-3 border border-blue-300 rounded-md shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="letter"
                      className="block text-xl font-medium text-blue-900 mb-2"
                    >
                      Cover Letter
                    </label>
                    <textarea
                      id="letter"
                      name="letter"
                      rows="4"
                      className="w-full px-4 py-3 border border-blue-300 rounded-md shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.letter}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={prevStep}
                className={`${
                  step > 1
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-300 cursor-not-allowed"
                } text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300`}
                disabled={step === 1}
              >
                Previous
              </button>
              <button
                type={step < 3 ? "button" : "submit"}
                onClick={step < 3 ? nextStep : undefined}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
              >
                {step < 3 ? "Next" : "Submit"}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default CandidateForm;
