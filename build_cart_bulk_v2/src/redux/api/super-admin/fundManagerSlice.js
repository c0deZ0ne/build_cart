import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const SuperAdminFundManagerApi = createApi({
  reducerPath: "SuperAdminFundManagerApi",
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
  endpoints: (fundManager) => ({
    getAllFundManagers: fundManager.query({
      query: () => ({
        url: "/superAdmin/fundManagers",
        method: "GET",
        // params: { page_size: 1000 },
      }),
    }),

    createFundManager: fundManager.mutation({
      query(data) {
        return {
          url: "/superAdmin/fundManagers",
          method: "POST",
          body: data,
        };
      },
      transformResponse: (response, meta, arg) => response.data,
    }),

    updateFundManager: fundManager.mutation({
      query(data) {
        const { id, payload } = data;
        return {
          url: `/superAdmin/fundManagers/${id}`,
          method: "PATCH",
          body: payload,
        };
      },
    }),

    addProcurementManToFundManager: fundManager.mutation({
      query(data) {
        const { fundmanagerId, procurementManagerId } = data;
        return {
          url: `/superAdmin/procurementManagers/fundManagers/${fundmanagerId}`,
          method: "PATCH",
          params: { procurementManagerId: procurementManagerId },
        };
      },
    }),

    createFundManagerProject: fundManager.mutation({
      query(data) {
        const { id, payload } = data;
        return {
          url: `/superAdmin/fundManagers/${id}/projects`,
          method: "POST",
          body: payload,
        };
      },
      transformResponse: (response, meta, arg) => response.data,
    }),

    getFundManager: fundManager.query({
      query: (fundmanagerId) => ({
        url: `/superAdmin/fundManagers/${fundmanagerId}`,
        method: "GET",
      }),
    }),

    getFundManagerProject: fundManager.query({
      query: (projectId) => ({
        url: `/superAdmin/fundManagers/projects/${projectId}`,
        method: "GET",
      }),
    }),

    getFundManagerProjectDetails: fundManager.query({
      query: (projectId) => ({
        url: `/superAdmin/fundManagers/projects/${projectId}/details`,
        method: "GET",
      }),
    }),

    getFundManagerBids: fundManager.query({
      query: (projectId) => ({
        url: `/superAdmin/projects/${projectId}/bids`,
        method: "GET",
      }),
    }),

    fundManagerAcceptBid: fundManager.mutation({
      query(data) {
        const { projectId, bidId } = data;
        return {
          url: `/superAdmin/fundManagers/projects/bids`,
          method: "PATCH",
          params: { projectId, bidId },
        };
      },
    }),
  }),
});

export const {
  useGetAllFundManagersQuery,
  useCreateFundManagerMutation,
  useUpdateFundManagerMutation,
  useAddProcurementManToFundManagerMutation,
  useCreateFundManagerProjectMutation,
  useGetFundManagerQuery,
  useGetFundManagerProjectQuery,
  useGetFundManagerBidsQuery,
  useFundManagerAcceptBidMutation,
  useGetFundManagerProjectDetailsQuery,
} = SuperAdminFundManagerApi;
