import React from "react";
import { Router } from "@reach/router";
import Login from "./routes/login";
import Dashboard from "./routes/dashboard";

function App() {
  return (
    <Router>
      <Login path="/" />
      <Dashboard path="/dashboard" />
    </Router>
  );
}

export default App;
