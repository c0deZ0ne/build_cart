import React from "react";
import { Switch, Route } from "react-router-dom";
import UserSignup from "../pages/auth/UserSignup";
import UserLogin from "../pages/auth/UserLogin";
import ForgotPassword from "../pages/auth/ForgotPassword";
import AdminLogin from "../pages/auth/adminLogin";
import ChangePassword from "../pages/auth/ChangePassword";
import OtpResend from "../pages/auth/OtpResend";
import SignupIntro from "../pages/auth/SignupIntro";

export default function PublicRoutes() {
  return (
    <>
      <Switch>
        <Route exact path="/auth/signup/:persona">
          <UserSignup />
        </Route>
        <Route exact path="/">
          <SignupIntro />
        </Route>
        <Route exact path="/login">
          <UserLogin />
        </Route>
        <Route exact path="/auth/forgot-password">
          <ForgotPassword />
        </Route>
        <Route exact path="/auth/request-otp">
          <OtpResend />
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
