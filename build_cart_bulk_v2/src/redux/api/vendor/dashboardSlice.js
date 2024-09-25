import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const vendorDashboardApi = createApi({
  reducerPath: "vendorDashboardApi",
  baseQuery: fetchBaseQuery({
    // base url of backend API
    baseUrl: process.env.REACT_APP_SERVER_ENDPOINT,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().userState.user.data.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
        return headers;
      }
    },
  }),
  endpoints: (dashboard) => ({
    getDashboard: dashboard.query({
      query: () => "/vendor/dashboard-summary",
    }),
    getDashboardEarningChart: dashboard.query({
      query: (dateFilter) => ({
        url: "/vendor/dashboard-summary/earnings",
        method: "GET",
        params: { dateFilter: dateFilter },
      }),
    }),
    getBuilderRFQ: dashboard.query({
      query: () => "/vendor/bidboard/rfq/request",
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useGetDashboardEarningChartQuery,
  useGetBuilderRFQQuery,
} = vendorDashboardApi;
