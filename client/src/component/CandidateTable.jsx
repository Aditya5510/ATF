import React, { useState } from "react";
import { motion } from "framer-motion";

const CandidateTable = ({ candidates }) => {
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const sortedCandidates = [...candidates].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md rounded-lg overflow-hidden"
    >
      <h2 className="text-2xl font-semibold p-6 bg-gray-50">Candidates</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Name",
                "Email",
                "College",
                "Degree",
                "CGPA",
                "ATS Score",
                "Status",
              ].map((header) => (
                <th
                  key={header}
                  onClick={() => handleSort(header.toLowerCase())}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  {header}
                  {sortColumn === header.toLowerCase() && (
                    <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCandidates.map((candidate, index) => (
              <motion.tr
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {candidate.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {candidate.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {candidate.college}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {candidate.degree}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {candidate.cgpa}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {candidate.atsScore}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      candidate.status === "Shortlisted"
                        ? "bg-green-100 text-green-800"
                        : candidate.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {candidate.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default CandidateTable;
