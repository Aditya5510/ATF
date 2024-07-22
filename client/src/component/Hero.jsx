import React from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

const Hero = () => {
  const [detailsPosted, setDetailsPosted] = useState(() => {
    return localStorage.getItem("detailsPosted") === "true";
  });

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-500 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 animate-fade-in-down">
          Streamline Your Hiring Process
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-indigo-100 mb-10 animate-fade-in-up">
          Powerful ATS solution to transform your recruitment workflow
        </p>
        <div className="flex justify-center space-x-4 animate-fade-in">
          <SignedOut>
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-100 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
              <SignInButton mode="modal">Get Started</SignInButton>
            </button>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-100 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
          <Link
            to="/features"
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Explore Features
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
