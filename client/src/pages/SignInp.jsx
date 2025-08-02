import React from "react";
import { SignIn } from "@clerk/clerk-react";

const SignInp = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Column */}
      <div className="hidden lg:flex items-center justify-center flex-1 bg-blue-600 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold">Welcome Back!</h1>
          <p className="mt-3 text-xl">
            Sign in to access your account and continue your journey with us.
          </p>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex items-center justify-center flex-1 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            afterSignInUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
};

export default SignInp;
