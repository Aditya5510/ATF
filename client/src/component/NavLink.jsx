import React from "react";
import { Link } from "react-router-dom";

const NavLink = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="relative text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-300 group"
    >
      {children}
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
    </Link>
  );
};

export default NavLink;
