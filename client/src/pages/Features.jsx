import React from "react";
import {
  FaBriefcase,
  FaLink,
  FaFileAlt,
  FaChartLine,
  FaRobot,
  FaUsers,
} from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaBriefcase className="w-6 h-6" />,
      title: "Easy Job Posting",
      description:
        "Post jobs quickly and easily, streamlining your recruitment process.",
    },
    {
      icon: <FaLink className="w-6 h-6" />,
      title: "Custom Application Links",
      description:
        "Generate unique links for each job posting for applicants to fill out forms.",
    },
    {
      icon: <FaFileAlt className="w-6 h-6" />,
      title: "Applicant Tracking",
      description:
        "Keep track of all your job postings and applicants in one place.",
    },
    {
      icon: <FaChartLine className="w-6 h-6" />,
      title: "ATS Score Calculation",
      description:
        "AI-powered ATS scoring to help you identify the best candidates quickly.",
    },
    {
      icon: <FaRobot className="w-6 h-6" />,
      title: "AI-Driven Insights",
      description:
        "Leverage AI to extract key features and insights from applications.",
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "Comprehensive Dashboard",
      description:
        "View all applicant details and analytics on an intuitive dashboard.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simplify Your Recruitment Process
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform offers cutting-edge features to streamline your hiring
            workflow and find the best candidates.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="pt-6">
                <div className="flow-root bg-white rounded-lg shadow-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
