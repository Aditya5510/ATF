import React from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import CreateJobModal from "./CreateJobModel";

const Hero = () => {
  const [detailsPosted, setDetailsPosted] = React.useState(() => {
    return localStorage.getItem("detailsPosted") === "true";
  });

  return (
    <div className="bg-gradient-to-br from-indigo-400 via-blue-400 to-purple-400 min-h-screen flex items-center overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white opacity-10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-pink-200 opacity-10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-yellow-200 opacity-10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 animate-fade-in-down">
          Streamline Your Hiring Process
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-10 animate-fade-in-up">
          Powerful ATS solution to transform your recruitment workflow
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in">
          <SignedOut>
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-100 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
              <SignInButton mode="modal">Get Started</SignInButton>
            </button>
          </SignedOut>
          <SignedIn>
            <Link
              to="/"
              className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-100 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hidden sm:inline-block"
            >
              hello
            </Link>
          </SignedIn>
          <Link
            to="/features"
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hidden sm:inline-block"
          >
            Features
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
