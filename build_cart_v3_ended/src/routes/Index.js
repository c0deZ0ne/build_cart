import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import AdminRoutes from "./AdminRoutes";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <PublicRoutes />
      </Switch>
      <PrivateRoutes />
      <AdminRoutes />
    </Router>
  );
}
