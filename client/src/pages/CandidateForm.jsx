import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Toaster, toast } from "react-hot-toast";

const CandidateForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);
  const [jobDetails, setJobdetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isResumeUploading, setIsResumeUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    degree: "",
    cgpa: "",
    resumeText: "",
    letter: "",
  });
  const { id } = useParams();

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
    if (type === "file") {
      handleFileUpload(files[0]);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.college.trim()) newErrors.college = "College is required";
    if (!formData.degree.trim()) newErrors.degree = "Degree is required";
    if (!formData.cgpa.trim()) newErrors.cgpa = "CGPA is required";
    else if (
      isNaN(formData.cgpa) ||
      parseFloat(formData.cgpa) < 0 ||
      parseFloat(formData.cgpa) > 10
    )
      newErrors.cgpa = "Invalid CGPA";
    if (!formData.resumeText.trim())
      newErrors.resumeText = "Resume is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting your application...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/applicant/application/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Application submission failed");
      }

      toast.success("Application submitted successfully!", {
        id: loadingToast,
      });
      // Reset form or redirect user
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(error.message, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (file) => {
    setIsResumeUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", "eng");
    formData.append("apikey", import.meta.env.VITE_OCR_KEY);
    formData.append("isOverlayRequired", "false");

    try {
      const response = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`OCR request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.ParsedResults && data.ParsedResults.length > 0) {
        const ocrResult = data.ParsedResults[0].ParsedText;
        setFormData((prevData) => ({
          ...prevData,
          resumeText: ocrResult,
        }));
      } else {
        throw new Error("OCR processing failed: No parsed results");
      }
    } catch (error) {
      console.error("Error processing resume:", error);
    } finally {
      setIsResumeUploading(false);
    }
  };
  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        {loading ? (
          <Skeleton />
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : (
          <motion.div {...fadeIn}>
            <h2 className="text-4xl font-bold text-center text-blue-800 mb-6">
              {jobDetails.title || "Job Title"}
            </h2>
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h3 className="text-2xl font-semibold text-blue-900 mb-4">
                Job Details
              </h3>
              <p className="text-lg text-blue-800 mb-2">
                <span className="font-medium">Company:</span>{" "}
                {jobDetails.company || "N/A"}
              </p>
              <p className="text-lg text-blue-800 mb-2">
                <span className="font-medium">Location:</span>{" "}
                {jobDetails.location || "N/A"}
              </p>
              <div className="text-lg text-blue-800 mb-2">
                <span className="font-medium">Description:</span>{" "}
                {jobDetails.description && (
                  <div className="mt-2">
                    <ReactMarkdown className="prose max-w-none">
                      {isDescriptionExpanded
                        ? jobDetails.description
                        : truncateDescription(jobDetails.description)}
                    </ReactMarkdown>
                    {jobDetails.description.length > 150 && (
                      <button
                        onClick={toggleDescription}
                        className="mt-2 text-blue-600 hover:text-blue-800 underline focus:outline-none"
                      >
                        {isDescriptionExpanded ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                )}
                {!jobDetails.description && (
                  <span>No description available</span>
                )}
              </div>
              <p className="text-lg text-blue-800 mb-2">
                <span className="font-medium">Deadline:</span>{" "}
                {jobDetails.deadline || "N/A"}
              </p>
              <p className="text-lg text-blue-800">
                <span className="font-medium">Status:</span>{" "}
                {jobDetails.status || "N/A"}
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
        )}

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
                      className={`w-full px-4 py-3 border ${
                        errors.name ? "border-red-500" : "border-blue-300"
                      } rounded-md shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                    )}
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
                      className={`w-full px-4 py-3 border ${
                        errors.email ? "border-red-500" : "border-blue-300"
                      } rounded-md shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
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
                      className={`w-full px-4 py-3 border ${
                        errors.college ? "border-red-500" : "border-blue-300"
                      } rounded-md shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      value={formData.college}
                      onChange={handleChange}
                    />
                    {errors.college && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.college}
                      </p>
                    )}
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
                      className={`w-full px-4 py-3 border ${
                        errors.degree ? "border-red-500" : "border-blue-300"
                      } rounded-md shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      value={formData.degree}
                      onChange={handleChange}
                    />
                    {errors.degree && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.degree}
                      </p>
                    )}
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
                      required
                      className={`w-full px-4 py-3 border ${
                        errors.cgpa ? "border-red-500" : "border-blue-300"
                      } rounded-md shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      value={formData.cgpa}
                      onChange={handleChange}
                    />
                    {errors.cgpa && (
                      <p className="mt-2 text-sm text-red-600">{errors.cgpa}</p>
                    )}
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
                      Upload Resume
                    </label>
                    <input
                      id="resume"
                      name="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-blue-300 rounded-md shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {isResumeUploading && (
                      <p className="mt-2 text-sm text-blue-600">
                        Uploading resume...
                      </p>
                    )}
                    {errors.resumeText && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.resumeText}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="letter"
                      className="block text-xl font-medium text-blue-900 mb-2"
                    >
                      Cover Letter (Optional)
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
            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition duration-300 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300 disabled:opacity-50 flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              )}
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
};

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-blue-200 rounded w-3/4 mb-6"></div>
    <div className="bg-blue-100 p-6 rounded-lg mb-8">
      <div className="h-6 bg-blue-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-blue-200 rounded w-5/6"></div>
        <div className="h-4 bg-blue-200 rounded w-4/6"></div>
        <div className="h-4 bg-blue-200 rounded w-3/6"></div>
      </div>
      <div className="mt-4 space-y-3">
        <div className="h-4 bg-blue-200 rounded w-5/6"></div>
        <div className="h-4 bg-blue-200 rounded w-4/6"></div>
        <div className="h-4 bg-blue-200 rounded w-3/6"></div>
      </div>
    </div>
    <div className="h-12 bg-blue-200 rounded w-full"></div>
  </div>
);

export default CandidateForm;
