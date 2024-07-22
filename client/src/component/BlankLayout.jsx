import React from "react";
import { Outlet } from "react-router-dom";

const BlankLayout = () => (
  <div>
    <Outlet />
  </div>
);

export default BlankLayout;
