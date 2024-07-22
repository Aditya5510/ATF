// CandidateTable.js
import React from "react";
import { motion } from "framer-motion";

const CandidateTable = () => {
  const candidates = [
    {
      name: "John Doe",
      job: "Software Engineer",
      atsScore: 85,
      status: "Interviewed",
    },
    {
      name: "Jane Smith",
      job: "Product Manager",
      atsScore: 78,
      status: "Screening",
    },
    {
      name: "Bob Johnson",
      job: "Data Analyst",
      atsScore: 92,
      status: "Offer Sent",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-8 bg-white shadow-md rounded-lg overflow-hidden"
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Job
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ATS Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {candidates.map((candidate, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <td className="px-6 py-4 whitespace-nowrap">{candidate.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{candidate.job}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {candidate.atsScore}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {candidate.status}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default CandidateTable;
