import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fundManagerApi = createApi({
  reducerPath: "fundManagerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_SERVER_ENDPOINT,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().userState.user.data.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
        return headers;
      }
    },
  }),

  // GET VENDORS
  endpoints: (fundManager) => ({
    getDashboard: fundManager.query({
      query: () => "/fundManager/overview",
    }),
    getDashboardProjectCost: fundManager.query({
      query: (dateFilter) => ({
        url: "/fundManager/overview/project/cost",
        method: "GET",
        params: { dateFilter: dateFilter },
      }),
    }),

    sendInviteToBuilder: fundManager.mutation({
      query(data) {
        return {
          url: "/fundManager/my/builder/send-invite",
          method: "POST",
          body: data,
        };
      },
    }),

    getAllProjects: fundManager.query({
      query(search) {
        return {
          url: "/fundManager/all-projects?page_size=100",
          method: "GET",
          params: { search },
        };
      },
    }),

    retrieveAllBuilders: fundManager.query({
      query(search) {
        return {
          url: "/fundManager/builders?page_size=100",
          method: "GET",
          params: { search },
        };
      },
    }),

    retriveMyBuilders: fundManager.query({
      query(search) {
        return {
          url: "/fundManager/my/builders?page_size=100",
          method: "GET",
          params: { search },
        };
      },
    }),

    addBuildersToFundManagersProfile: fundManager.mutation({
      query(buildersId) {
        return {
          url: "/fundManager/my/builders",
          method: "PATCH",
          body: { buildersId },
        };
      },
    }),

    getBuilderDetails: fundManager.query({
      query(builderId) {
        return {
          url: "/fundManager/builder-details",
          method: "GET",
          params: { builderId },
        };
      },
    }),

    getAccountDetails: fundManager.query({
      query(email) {
        return {
          url: "/user/account-details",
          params: { email },
          method: "GET",
        };
      },
    }),

    getTransactionHistory: fundManager.query({
      query(queryString) {
        return {
          url: `/fundmanager/transaction/history${queryString}?page_size=100`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useGetDashboardProjectCostQuery,
  useGetAllProjectsQuery,
  useRetrieveAllBuildersQuery,
  useRetriveMyBuildersQuery,
  useGetBuilderDetailsQuery,
  useGetAccountDetailsQuery,
  useGetTransactionHistoryQuery,
  useAddBuildersToFundManagersProfileMutation,
  useSendInviteToBuilderMutation,
} = fundManagerApi;
