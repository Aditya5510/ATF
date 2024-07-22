// AnalyticsCharts.js
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const AnalyticsCharts = () => {
  const data = [
    { name: "Jan", applications: 65, hires: 4 },
    { name: "Feb", applications: 59, hires: 3 },
    { name: "Mar", applications: 80, hires: 5 },
    { name: "Apr", applications: 81, hires: 6 },
    { name: "May", applications: 56, hires: 4 },
    { name: "Jun", applications: 55, hires: 3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4">Applications vs Hires</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="applications" fill="#3b82f6" />
          <Bar dataKey="hires" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default AnalyticsCharts;
