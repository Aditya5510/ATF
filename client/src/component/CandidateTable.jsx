import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const CandidateTable = ({ candidates, onStatusChange }) => {
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [loading, setLoading] = useState(false);

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

  const toggleStatus = useCallback(
    async (candidateId, currentStatus) => {
      setLoading(true);
      const newStatus = currentStatus === "Applied" ? "Shortlisted" : "Applied";

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/user/candidate/${candidateId}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              token: `${token}`,
            },
            body: JSON.stringify({ status: newStatus }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        await onStatusChange();
        toast.success(`Candidate status updated to ${newStatus}`);
      } catch (error) {
        console.error("Error updating candidate status:", error);
        toast.error("Failed to update candidate status. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [onStatusChange]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md rounded-lg overflow-hidden w-full" // Added w-full here
    >
      <h2 className="text-2xl font-semibold p-6 bg-gray-50">Candidates</h2>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
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
            <AnimatePresence>
              {loading ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan="7" className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  </td>
                </motion.tr>
              ) : (
                sortedCandidates.map((candidate, index) => (
                  <motion.tr
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
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
                      <button
                        onClick={() =>
                          toggleStatus(candidate.id, candidate.status)
                        }
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${
                          candidate.status === "Shortlisted"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        }`}
                      >
                        {candidate.status}
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default CandidateTable;
