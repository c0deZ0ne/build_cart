import React from "react";
import { Switch, Route } from "react-router-dom";
import UserSignup from "../pages/auth/UserSignup";
import UserLogin from "../pages/auth/UserLogin";
import ForgotPassword from "../pages/auth/ForgotPassword";
import AdminLogin from "../pages/auth/adminLogin";
import ChangePassword from "../pages/auth/ChangePassword";
// import RequestOTP from "../pages/auth/RequestOTP";
// import OtpResend from "../pages/auth/OtpResend";

export default function PublicRoutes() {
  return (
    <>
      <Switch>
        <Route exact path="/auth/signup">
          <UserSignup />
        </Route>
        <Route exact path="/">
          <UserLogin />
        </Route>
        <Route exact path="/auth/forgot-password">
          <ForgotPassword />
        </Route>
        <Route exact path="/verify-password-reset">
          <ChangePassword />
        </Route>
        <Route exact path="/admin/login">
          <AdminLogin />
        </Route>
      </Switch>
    </>
  );
}
