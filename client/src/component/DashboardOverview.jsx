import React from "react";
import { motion } from "framer-motion";

const DashboardOverview = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-600">{stat.label}</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardOverview;
