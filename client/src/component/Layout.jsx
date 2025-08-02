// Layout.js
import React, { useState } from "react";
import { motion } from "framer-motion";
// import Sidebar from "./Sidebar";
// import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-auto bg-gradient-to-b from-blue-50 to-white">
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-6 py-8 mt-10"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
