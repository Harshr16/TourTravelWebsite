import React from "react";
import Footer from "../common/Footer"; 
import { Outlet } from "react-router-dom"; // Allows nested routes to be rendered

const Layout = () => {
  return (
    <div>
      <Outlet /> 
      <Footer /> 
    </div>
  );
};

export default Layout;
