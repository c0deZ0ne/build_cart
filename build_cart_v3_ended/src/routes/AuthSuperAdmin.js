import React from "react";
import { Route, useHistory } from "react-router-dom";

export default function AuthSuperAdmin({ children, exact, ...rest }) {
  let history = useHistory();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <Route
      {...rest}
      exact
      render={() =>
        token && user.userType === "SUPER_ADMIN"
          ? children
          : history.push("/admin/login")
      }
    />
  );
}
