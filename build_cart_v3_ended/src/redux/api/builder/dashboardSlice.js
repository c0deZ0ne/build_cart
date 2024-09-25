import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
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
      query: () => "/builder/overview",
    }),
    getDashboardProjectCost: dashboard.query({
      query: (dateFilter) => ({
        url: "/builder/overview/project/cost",
        method: "GET",
        params: { dateFilter: dateFilter },
      }),
    }),
  }),
});

export const { useGetDashboardQuery, useGetDashboardProjectCostQuery } =
  dashboardApi;
