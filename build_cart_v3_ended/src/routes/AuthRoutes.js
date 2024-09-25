import { lowerCase } from "lodash";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, useHistory } from "react-router-dom";
import { subscriptionChecker } from "../redux/features/subscription/subscriptionSlice";

export default function AuthRoute({ children, exact, path, ...rest }) {
  let history = useHistory();
  const token = localStorage.getItem("token");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const { isSubscribe, userType } = userInfo ?? {};
  const dashboardUrl = `/${lowerCase(userType).replaceAll(" ", "-")}/dashboard`;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(subscriptionChecker());
  }, [path, dispatch]);

  return (
    <Route
      {...rest}
      exact
      render={() =>
        token
          ? userType === "FUND_MANAGER" || userType === "BUILDER"
            ? isSubscribe
              ? children
              : path === "/builder/dashboard" ||
                path === "/fund-manager/dashboard" ||
                path === "/support"
              ? children
              : history.push(dashboardUrl)
            : children
          : history.push(`/`)
      }
    />
  );
}
