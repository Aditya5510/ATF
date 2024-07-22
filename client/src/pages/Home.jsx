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

const Home = () => {
  return (
    <>
      <SignedIn>
        <div className="flex justify-center items-center h-screen">
          <div className="text-3xl font-semibold text-center">
            Welcome to your Clerk app!
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <Hero />
      </SignedOut>
    </>
  );
};

export default Home;
