// GlobalLoader.js
import React from "react";
import { useLoading } from "../contexts/LoadingContext";
// import Spinner from "./components/Spinner";
import Spinner from "./Spinner";

const GlobalLoader = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Spinner size={60} color="#ffffff" thickness={5} />
    </div>
  );
};

export default GlobalLoader;
