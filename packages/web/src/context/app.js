import React from "react";
import { AuthProvider } from "./auth";
import { UserProvider } from "./user";

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
};

export default AppProviders;
