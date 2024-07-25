// Dashboard.js
import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import DashboardOverview from "./DashboardOverview";
import JobPostingForm from "./JobPostingForm";
import AnalyticsCharts1 from "./AnalyticsChart1";
import { useUser } from "@clerk/clerk-react";
// import useDashboardData from "../hooks/useDashboardData";
import { useDashboard } from "../contexts/DashboardContext";

const Dashboard = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const { dashboardData, loading, error } = useDashboard();

  if (!isLoaded || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to view the dashboard.</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 ">
        Welcome, {user.firstName}!
      </h1>
      <DashboardOverview stats={dashboardData.stats} />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <JobPostingForm />
        <AnalyticsCharts1
          totalApplicants={dashboardData.totalApplicants}
          shortlistedApplicants={dashboardData.shortlistedApplicants}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
