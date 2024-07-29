import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Toaster, toast } from "react-hot-toast";
import { ChevronDownIcon, ChevronUpIcon, Loader2Icon } from "lucide-react";

const CandidateForm = () => {
  const [jobDetails, setJobDetails] = useState({});
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

  useEffect(() => {
    const fetchJobDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/jobopening/${id}`,
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
        }
        const data = await response.json();
        setJobDetails(data);
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
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/applicant/application/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
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
      toast.error("Failed to process resume. Please try again.");
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

  if (loading) return <Skeleton />;
  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          <div className="p-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-6">
              {jobDetails.title || "Job Application"}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                  Job Details
                </h2>
                <div className="space-y-3">
                  <p className="text-lg text-gray-700">
                    <span className="font-medium">Company:</span>{" "}
                    {jobDetails.company || "N/A"}
                  </p>
                  <p className="text-lg text-gray-700">
                    <span className="font-medium">Location:</span>{" "}
                    {jobDetails.location || "N/A"}
                  </p>
                  <div className="text-lg text-gray-700">
                    <span className="font-medium">Description:</span>
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
                            className="mt-2 text-blue-600 hover:text-blue-800 flex items-center focus:outline-none"
                          >
                            {isDescriptionExpanded ? (
                              <>
                                Show less <ChevronUpIcon className="ml-1" />
                              </>
                            ) : (
                              <>
                                Show more <ChevronDownIcon className="ml-1" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                    {!jobDetails.description && (
                      <span>No description available</span>
                    )}
                  </div>
                  <p className="text-lg text-gray-700">
                    <span className="font-medium">Deadline:</span>{" "}
                    {jobDetails.deadline || "N/A"}
                  </p>
                  <p className="text-lg text-gray-700">
                    <span className="font-medium">Status:</span>{" "}
                    {jobDetails.status || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                  Application Form
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <InputField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                  />
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                  <InputField
                    label="College"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    error={errors.college}
                  />
                  <InputField
                    label="Degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    error={errors.degree}
                  />
                  <InputField
                    label="CGPA"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    error={errors.cgpa}
                  />
                  <div>
                    <label
                      htmlFor="resume"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Upload Resume
                    </label>
                    <input
                      id="resume"
                      name="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {isResumeUploading && (
                      <p className="mt-1 text-sm text-blue-600">
                        Uploading resume...
                      </p>
                    )}
                    {errors.resumeText && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.resumeText}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="letter"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      id="letter"
                      name="letter"
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.letter}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2Icon className="animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, type = "text", value, onChange, error }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      required
      className={`w-full px-3 py-2 border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
      value={value}
      onChange={onChange}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const Skeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden animate-pulse">
        <div className="p-8">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CandidateForm;
