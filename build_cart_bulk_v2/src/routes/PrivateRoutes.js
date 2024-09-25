import React from "react";
import { Switch } from "react-router-dom";
import AuthRoute from "./AuthRoutes";

// BUILDER IMPORTS
import BuilderDashboard from "../pages/builder/dashboard";
import FundManagerDetailsPage from "../pages/builder/fundManager/FundManagerDetailsPage";
import BuilderFundManager from "../pages/builder/fundManager/fundManager";
import ProjectInvitations from "../pages/builder/projects/ProjectInvitations";
import BuilderCompanyProject from "../pages/builder/projects/companyProject";
import BuilderCompanyProjectDetails from "../pages/builder/projects/companyProjectDetails";
import BuilderFundManagerProject from "../pages/builder/projects/fundManagerProject";
import ViewBids from "../pages/builder/projects/proceedRFQ";
import SettingsView from "../pages/builder/settings/SettingsView";
import BuilderVault from "../pages/builder/vaults";
import BuilderVendorDetailsPage from "../pages/builder/vendor/VendorDetailsPage";
import BuilderVendorDashboard from "../pages/builder/vendor/dashboard";
import VendorSettingsView from "../pages/vendor/settings/SettingsView";

// FUNDMANAGER IMPORTS
import FundManagerDashboard from "../pages/fundManager/dashboard";
import FundManagerProject from "../pages/fundManager/projects/companyProject";
import FundManagerProjectDetails from "../pages/fundManager/projects/companyProjectDetails";
import FundManagerViewBids from "../pages/fundManager/projects/proceedRFQ";
import FundManagerProjectInvitations from "../pages/fundManager/projectInvitations";
import FundManagerBuilders from "../pages/fundManager/builders";
import FundManagerSingleBuilder from "../pages/fundManager/singleBuilderDetails";
import FundManagerVaultPage from "../pages/fundManager/vault";
import FundManagerSettingsView from "../pages/fundManager/settings/SettingsView";

// VENDOR IMPORTS
import OrderManagement from "../pages/vendor/OrderManagement/OrderManagement";
import ProductCategories from "../pages/vendor/ProductCategories/ProductCategories";
import VendorBidBoard from "../pages/vendor/bidBoard/bids";
import VendorDashboard from "../pages/vendor/dashboard";
import VendorEarningsWithdrawal from "../pages/vendor/incomeAndWithdrawal";

// GLOBAL
import Support from "../pages/general/support";
import Teams from "../pages/general/teams/teams";

export default function PrivateRoutes() {
  return (
    <Switch>
      {/* BUILDER ROUTES */}
      <AuthRoute exact path="/builder/dashboard">
        <BuilderDashboard />
      </AuthRoute>
      <AuthRoute exact path="/builder/company-project">
        <BuilderCompanyProject />
      </AuthRoute>
      <AuthRoute exact path="/builder/company-project/details/:projectId">
        <BuilderCompanyProjectDetails />
      </AuthRoute>
      <AuthRoute exact path="/builder/company-project/view-bids/:requestId">
        <ViewBids />
      </AuthRoute>
      <AuthRoute exact path="/builder/fund-manager">
        <BuilderFundManager />
      </AuthRoute>
      <AuthRoute exact path="/builder/fund-manager-project">
        <BuilderFundManagerProject />
      </AuthRoute>
      <AuthRoute exact path="/builder/fund-manager/:id">
        <FundManagerDetailsPage />
      </AuthRoute>
      <AuthRoute exact path="/builder/project-invitations">
        <ProjectInvitations />
      </AuthRoute>
      <AuthRoute exact path="/builder/vault">
        <BuilderVault />
      </AuthRoute>
      <AuthRoute exact path="/builder/vendors">
        <BuilderVendorDashboard />
      </AuthRoute>
      <AuthRoute exact path="/builder/vendors/:vendorId">
        <BuilderVendorDetailsPage />
      </AuthRoute>
      <AuthRoute exact path="/builder/settings">
        <SettingsView />
      </AuthRoute>
      <AuthRoute
        exact
        path="/builder/fund-manager/:fundManagerId/projects/:projectId"
      >
        <BuilderCompanyProjectDetails />
      </AuthRoute>

      {/* FUNDMANAGER ROUTES */}
      <AuthRoute exact path="/fund-manager/dashboard">
        <FundManagerDashboard />
      </AuthRoute>
      <AuthRoute exact path="/fund-manager/project">
        <FundManagerProject />
      </AuthRoute>
      <AuthRoute exact path="/fund-manager/project/details/:projectId">
        <FundManagerProjectDetails />
      </AuthRoute>
      <AuthRoute exact path="/fund-manager/project/view-bids/:requestId">
        <FundManagerViewBids />
      </AuthRoute>
      <AuthRoute exact path="/fund-manager/invitations">
        <FundManagerProjectInvitations />
      </AuthRoute>
      <AuthRoute exact path="/fund-manager/builders">
        <FundManagerBuilders />
      </AuthRoute>
      <AuthRoute exact path="/fund-manager/builders/:builderId">
        <FundManagerSingleBuilder />
      </AuthRoute>
      <AuthRoute exact path="/fund-manager/vault">
        <FundManagerVaultPage />
      </AuthRoute>
      <AuthRoute exact path="/fund-manager/settings">
        <FundManagerSettingsView />
      </AuthRoute>

      {/* VENDOR ROUTES */}
      <AuthRoute exact path="/vendor/dashboard">
        <VendorDashboard />
      </AuthRoute>
      <AuthRoute exact path="/supplier/dashboard">
        <VendorDashboard />
      </AuthRoute>
      <AuthRoute exact path="/vendor/categories">
        <ProductCategories />
      </AuthRoute>
      <AuthRoute exact path="/vendor/order-management">
        <OrderManagement />
      </AuthRoute>
      <AuthRoute exact path="/vendor/bid-board">
        <VendorBidBoard />
      </AuthRoute>
      <AuthRoute exact path="/vendor/earnings-withdrawals">
        <VendorEarningsWithdrawal />
      </AuthRoute>
      <AuthRoute exact path="/vendor/settings">
        <VendorSettingsView />
      </AuthRoute>
      <AuthRoute exact path="/supplier/settings">
        <VendorSettingsView />
      </AuthRoute>

      {/* GENERAL ROUTES */}

      <AuthRoute exact path="/support">
        <Support />
      </AuthRoute>
      <AuthRoute exact path="/team">
        <Teams />
      </AuthRoute>
    </Switch>
  );
}
