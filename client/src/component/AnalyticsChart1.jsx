// AnalyticsCharts.js
import React from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const AnalyticsCharts1 = ({ totalApplicants, shortlistedApplicants }) => {
  const data = [
    { name: "Shortlisted", value: shortlistedApplicants },
    { name: "Others", value: totalApplicants - shortlistedApplicants },
  ];

  const COLORS = ["#10B981", "#6B7280"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4">Application Analytics</h2>
      <div className="mb-4">
        <p className="text-gray-600">Total Applicants</p>
        <p className="text-3xl font-bold">{totalApplicants}</p>
      </div>
      <div className="mb-4">
        <p className="text-gray-600">Shortlisted Applicants</p>
        <p className="text-3xl font-bold text-green-600">
          {shortlistedApplicants}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default AnalyticsCharts1;
