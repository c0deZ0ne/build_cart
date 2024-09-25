import React from "react";
import { Switch } from "react-router-dom";
// ADMIN IMPORTS

import ChangeAdminPassword from "../pages/auth/changeAdminPassword";
import SuperAdminBuilders from "../pages/super-admin/builder/builders";
import RfqBidDetails from "../pages/super-admin/builder/rfqBidDetails";
import SuperAdminDashboard from "../pages/super-admin/dashboard";
import SuperAdminFundManagers from "../pages/super-admin/fund-manager/fundManagers";
import FundManagerProjectDetails from "../pages/super-admin/fund-manager/project/ProjectDetails";
import SuperAdminLogs from "../pages/super-admin/logs/logs";
import SuperAdminSingleUserLogs from "../pages/super-admin/logs/singleUserLogs";
import SuperAdminPayouts from "../pages/super-admin/payouts/payouts";
import SuperAdminProductCategory from "../pages/super-admin/product-category/productCategory";
import SingleProductCategory from "../pages/super-admin/product-category/singleProductCategory";
import SuperAdminSettingsView from "../pages/super-admin/settings/SettingsView";
import SuperAdminTeam from "../pages/super-admin/team/team";
import SuperAdminTransactionsOrders from "../pages/super-admin/transactions/orders";
import SuperAdminTransactionsRevenues from "../pages/super-admin/transactions/revenue";
import IdVerification from "../pages/super-admin/customer-support/id-verification/idVerification";
import AuthAdmin from "./AuthAdmin";
import AuthSuperAdmin from "./AuthSuperAdmin";
import SuperAdminVendors from "../pages/super-admin/vendor/vendors";
import Dispute from "../pages/super-admin/customer-support/dispute/dispute";
import AccountRecovery from "../pages/super-admin/customer-support/account-recovery/AccountRecovery";

export default function AdminRoutes() {
  return (
    <Switch>
      <AuthSuperAdmin exact path="/super-admin/dashboard">
        <SuperAdminDashboard />
      </AuthSuperAdmin>
      <AuthAdmin exact path="/admin/create-password">
        <ChangeAdminPassword />
      </AuthAdmin>
      <AuthSuperAdmin exact path="/super-admin/fund-managers">
        <SuperAdminFundManagers />
      </AuthSuperAdmin>
      <AuthSuperAdmin exact path="/super-admin/product-category">
        <SuperAdminProductCategory />
      </AuthSuperAdmin>
      <AuthSuperAdmin
        exact
        path="/super-admin/fund-managers/project/:projectId"
      >
        <FundManagerProjectDetails pageTitle="Fund Manager" />
      </AuthSuperAdmin>
      <AuthSuperAdmin exact path="/super-admin/builders">
        <SuperAdminBuilders />
      </AuthSuperAdmin>
      <AuthSuperAdmin exact path="/super-admin/payouts">
        <SuperAdminPayouts />
      </AuthSuperAdmin>
      <AuthSuperAdmin exact path="/super-admin/team">
        <SuperAdminTeam />
      </AuthSuperAdmin>
      <AuthSuperAdmin exact path="/super-admin/settings">
        <SuperAdminSettingsView />
      </AuthSuperAdmin>
      <AuthSuperAdmin exact path="/super-admin/logs">
        <SuperAdminLogs />
      </AuthSuperAdmin>

      <AuthSuperAdmin exact path="/super-admin/logs/user/:userId">
        <SuperAdminSingleUserLogs />
      </AuthSuperAdmin>

      <AuthSuperAdmin
        exact
        path="/super-admin/product-category/:productCategoryId"
      >
        <SingleProductCategory />
      </AuthSuperAdmin>
      <AuthSuperAdmin exact path="/super-admin/rfq-details/:requestId">
        <RfqBidDetails />
      </AuthSuperAdmin>
      <AuthSuperAdmin exact path="/super-admin/builder/project/:projectId">
        <FundManagerProjectDetails pageTitle="Builder" />
      </AuthSuperAdmin>
      <AuthSuperAdmin exact path="/super-admin/payouts">
        <SuperAdminPayouts />
      </AuthSuperAdmin>

      <AuthSuperAdmin exact path="/super-admin/transactions/orders">
        <SuperAdminTransactionsOrders />
      </AuthSuperAdmin>

      <AuthSuperAdmin exact path="/super-admin/transactions/revenue">
        <SuperAdminTransactionsRevenues />
      </AuthSuperAdmin>
      <AuthSuperAdmin exact path="/super-admin/vendors">
        <SuperAdminVendors />
      </AuthSuperAdmin>
      <AuthSuperAdmin exact path="/super-admin/verification">
        <IdVerification />
      </AuthSuperAdmin>
      <AuthSuperAdmin exact path="/super-admin/dispute">
        <Dispute />
      </AuthSuperAdmin>
      <AuthSuperAdmin exact path="/super-admin/account-recovery">
        <AccountRecovery />
      </AuthSuperAdmin>
    </Switch>
  );
}
