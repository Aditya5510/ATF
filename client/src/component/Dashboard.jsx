import React from "react";
import Layout from "./Layout";
import DashboardOverview from "./DashboardOverview";
import JobPostingForm from "./JobPostingForm";
import CandidateTable from "./CandidateTable";
import AnalyticsCharts from "./AnalyticsCharts";
import { useUser } from "@clerk/clerk-react";

const Dashboard = () => {
  const { user } = useUser();
  //   console.log(user);
  return (
    <Layout>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 ">
        Welcome , {user.firstName}
      </h1>
      <DashboardOverview />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <JobPostingForm />
        <AnalyticsCharts />
      </div>
      <CandidateTable />
    </Layout>
  );
};

export default Dashboard;
