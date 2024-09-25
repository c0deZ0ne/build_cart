import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import rfqReducer from "../../features/rfq/rfqSlice";
import { loginApi } from "../../redux/api/auth/authSlice";
import { registerBuilderApi } from "../../redux/api/builder/builderRegisterSlice";
import { dashboardApi } from "../../redux/api/builder/dashboardSlice";
import { projectApi } from "../../redux/api/builder/projectSlice";
import { changePasswordApi } from "../../redux/api/user/userPasswordSlice";
import { authApiVendor } from "../../redux/api/vendor/authenticatedSlice";
import { vendorDashboardApi } from "../../redux/api/vendor/dashboardSlice";
import { vendorSettingsApi } from "../../redux/api/vendor/settingsApiService";
import { registerVendorApi } from "../../redux/api/vendor/vendorRegisterSlice";
import { api } from "../api/api";
import { builderApi } from "../api/builder/builder";
import { fundManagerApi } from "../api/fundManager/fundManager";
import { productsApi } from "../api/product/productSlice";
import { rfqApi } from "../api/rfq/rfq";
import { SuperAdminBuilderApi } from "../api/super-admin/builderSlice";
import { SuperAdminFundManagerApi } from "../api/super-admin/fundManagerSlice";
import { superAdminApi } from "../api/super-admin/superAdminSlice";
import { SuperAdminUtilityApi } from "../api/super-admin/utilitySlice";
import { vendorApi } from "../api/vendor/vendor";
import userReducer from "../features/user/userSlice";
import { SuperAdminVendorApi } from "../api/super-admin/vendorSlice";
import paymentSlice from "../../context/paymentContext/paymentSlice";
import subscriptionSlice from "../features/subscription/subscriptionSlice";
// import {setupListeners} from '@reduxjs/toolkit/query'

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);
export const store = configureStore({
  reducer: {
    userState: persistedReducer,
    payment: paymentSlice.reducer,
    subscription: subscriptionSlice.reducer,
    rfq: rfqReducer, // old
    [api.reducerPath]: api.reducer,
    [registerVendorApi.reducerPath]: registerVendorApi.reducer,
    [paymentSlice.reducerPath]: paymentSlice.reducer,
    [registerBuilderApi.reducerPath]: registerBuilderApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [authApiVendor.reducerPath]: authApiVendor.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [builderApi.reducerPath]: builderApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [rfqApi.reducerPath]: rfqApi.reducer,
    [vendorApi.reducerPath]: vendorApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [vendorDashboardApi.reducerPath]: vendorDashboardApi.reducer,
    [vendorSettingsApi.reducerPath]: vendorSettingsApi.reducer,
    [changePasswordApi.reducerPath]: changePasswordApi.reducer,
    [SuperAdminFundManagerApi.reducerPath]: SuperAdminFundManagerApi.reducer,
    [SuperAdminUtilityApi.reducerPath]: SuperAdminUtilityApi.reducer,
    [fundManagerApi.reducerPath]: fundManagerApi.reducer,
    [SuperAdminBuilderApi.reducerPath]: SuperAdminBuilderApi.reducer,
    [superAdminApi.reducerPath]: superAdminApi.reducer,
    [SuperAdminVendorApi.reducerPath]: SuperAdminVendorApi.reducer,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([
      api.middleware,
      registerVendorApi.middleware,
      registerBuilderApi.middleware,
      loginApi.middleware,
      authApiVendor.middleware,
      projectApi.middleware,
      builderApi.middleware,
      dashboardApi.middleware,
      thunk,
      rfqApi.middleware,
      vendorApi.middleware,
      productsApi.middleware,
      vendorDashboardApi.middleware,
      vendorSettingsApi.middleware,
      changePasswordApi.middleware,
      SuperAdminFundManagerApi.middleware,
      SuperAdminUtilityApi.middleware,
      fundManagerApi.middleware,
      SuperAdminBuilderApi.middleware,
      superAdminApi.middleware,
      SuperAdminVendorApi.middleware,
    ]),
});

export const persistor = persistStore(store);
export const userData = (state) => state.userState.user;
export const subscriptionData = (state) => state.subscriptionState;

// setupListeners(store.dispatch);
