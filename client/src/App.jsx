import React from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./component/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { LoadingProvider } from "./contexts/LoadingContext";
import GlobalLoader from "./component/GlobalLoader";
import Jobs from "./pages/Jobs";
import ProtectedRoute from "./utils/ProtectedRoute";
import SignInp from "./pages/SignInp";
import Features from "./pages/Features";
import CandidateForm from "./pages/CandidateForm";
import MainLayout from "./component/MainLayout";
import BlankLayout from "./component/BlankLayout";
import JobDetailsPage from "./pages/JobDetailsPage";
import Contact from "./pages/Contact";
import { DashboardProvider } from "./contexts/DashboardContext";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <DashboardProvider>
          <LoadingProvider>
            <GlobalLoader />
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route
                  path="/jobs"
                  element={
                    <ProtectedRoute>
                      <Jobs />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<h1>Not Found</h1>} />
                <Route path="/features" element={<Features />} />
                <Route path="/sign-in" element={<SignInp />} />
                <Route path="/job/:jobId" element={<JobDetailsPage />} />
              </Route>
              <Route element={<BlankLayout />}>
                <Route path="/apply/:id" element={<CandidateForm />} />
                <Route path="/application" element={<Contact />} />
              </Route>
            </Routes>
          </LoadingProvider>
        </DashboardProvider>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },

          error: {
            duration: 3000,
            theme: {
              primary: "red",
              secondary: "black",
            },
          },
        }}
      />
    </>
  );
}
