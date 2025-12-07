import React from "react";
import { Outlet } from "react-router-dom";

/**
 * AuthLayout - Layout for unauthenticated pages
 * Simple wrapper with minimal UI for landing page
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
