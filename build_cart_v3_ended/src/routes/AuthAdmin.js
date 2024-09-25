import React from "react";
import { Route, useHistory } from "react-router-dom";

export default function AuthAdmin({ children, exact, ...rest }) {
  let history = useHistory();

  const token = localStorage.getItem("token");

  return (
    <Route
      {...rest}
      exact
      render={() => (token ? children : history.push("/"))}
    />
  );
}
