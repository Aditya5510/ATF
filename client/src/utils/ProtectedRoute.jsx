import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Spinner from "../component/Spinner"; // Assuming you have a Spinner component

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={40} thickness={4} />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
