import React from "react";
import {
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  ClerkLoading,
} from "@clerk/clerk-react";
import Hero from "../component/Hero";
import CreateJobModal from "../component/CreateJobModel";
import Dashboard from "../component/Dashboard";

const Home = () => {
  return (
    <>
      <SignedIn>
        <div className="mt-10">
          {" "}
          <Dashboard />
        </div>
      </SignedIn>
      <SignedOut>
        <Hero />
      </SignedOut>
    </>
  );
};

export default Home;
