import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const builderApi = createApi({
  reducerPath: "builder",
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
  endpoints: (builder) => ({
    getVendors: builder.query({
      query(searchTerm) {
        return {
          url: "builder/vendors",
          method: "GET",
          params: { search: searchTerm.trim(""), page_size: 1000 },
        };
      },
    }),

    getMyVendors: builder.query({
      query(searchTerm) {
        return {
          url: "builder/vendor/my",
          method: "GET",
          params: { search: searchTerm.trim(""), page_size: 1000 },
        };
      },
    }),

    sendInviteToVendor: builder.mutation({
      query(data) {
        return {
          body: data,
          url: "builder/send-invite",
          method: "POST",
        };
      },
    }),
    getSingleVendorById: builder.query({
      query(vendorId) {
        return {
          url: `builder/vendor/${vendorId}`,
        };
      },
    }),

    addToMyVendors: builder.mutation({
      query(vendorId) {
        return {
          url: `builder/vendor/${vendorId}`,
          method: "POST",
        };
      },
    }),

    getAllProjectInvitations: builder.query({
      query() {
        return {
          url: "/builder/project/invitation-listing?page_size=100",
          method: "GET",
        };
      },
    }),

    getSubmittedTenders: builder.query({
      query() {
        return {
          url: "builder/project/submitted-tenders?page_size=100",
          method: "GET",
        };
      },
    }),

    getAcceptedTenders: builder.query({
      query() {
        return {
          url: "/builder/project/accepted-tenders?page_size=100",
          method: "GET",
        };
      },
    }),

    deleteProjectInvitations: builder.mutation({
      query(tenderId) {
        return {
          url: `/builder/project-invitation/${tenderId}/remove`,
          method: "DELETE",
        };
      },
    }),

    sendInviteToFundManager: builder.mutation({
      query(data) {
        return {
          url: "/builder/fundmanagers/send-invite",
          method: "POST",
          body: data,
        };
      },
    }),
    bidOnAProject: builder.mutation({
      query(data) {
        return {
          url: "/builder/project/doc-tender",
          method: "POST",
          body: data,
        };
      },
    }),
    getBidDetailsById: builder.query({
      query(bidId) {
        return {
          url: `/builder/project/${bidId}/tender-view `,
          method: "GET",
        };
      },
    }),

    getMyFundManagers: builder.query({
      query(searchTerm) {
        return {
          url: `/builder/my/fundmanagers?page_size=100`,
          method: "GET",
          params: { search: searchTerm.trim() },
        };
      },
    }),

    addFundManagersToBuildersProfile: builder.mutation({
      query(fundManagersIds) {
        return {
          url: "/builder/my/fundmanagers",
          method: "PATCH",
          body: {
            fundmanagersId: fundManagersIds,
          },
        };
      },
    }),

    getFundManagerProfile: builder.query({
      query(fundmanagerId) {
        return {
          url: "/builder/fundmanager-profile",
          method: "GET",
          params: { fundmanagerId },
        };
      },
    }),
    getFundManagerProjects: builder.query({
      query({ id, searchTerm }) {
        return {
          url: "/builder/fund-manager/projects",
          method: "GET",
          params: { fundmanagerId: id, search: searchTerm.trim() },
        };
      },
    }),

    getVendorsProductsByVendorId: builder.query({
      query({ vendorId, searchTerm }) {
        return {
          url: `/builder/vendors/${vendorId}/vendor-products`,
          params: { searchParam: searchTerm.trim() },
        };
      },
    }),
    saveBankDetails: builder.mutation({
      query: (data) => ({
        url: "/builder/bank",
        method: "POST",
        body: data,
      }),
    }),

    addBuilderPortfolio: builder.mutation({
      query({ data }) {
        return {
          url: "/builder/portfolio",
          method: "POST",
          body: data,
        };
      },
    }),

    getBuilderPortfolio: builder.query({
      query() {
        return {
          url: "/builder/portfolio",
        };
      },
    }),

    editBuilderPortfolio: builder.mutation({
      query({ data }) {
        return {
          url: "/builder/portfolio/edit",
          method: "PATCH",
          body: data,
        };
      },
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useSendInviteToVendorMutation,
  useGetMyVendorsQuery,
  useAddToMyVendorsMutation,
  useGetSingleVendorByIdQuery,
  useGetAllProjectInvitationsQuery,
  useGetSubmittedTendersQuery,
  useGetAcceptedTendersQuery,
  useDeleteProjectInvitationsMutation,
  useSendInviteToFundManagerMutation,
  useBidOnAProjectMutation,
  useGetBidDetailsByIdQuery,
  useGetMyFundManagersQuery,
  useAddFundManagersToBuildersProfileMutation,
  useGetFundManagerProfileQuery,
  useGetFundManagerProjectsQuery,
  useGetVendorsProductsByVendorIdQuery,
  useSaveBankDetailsMutation,
  useAddBuilderPortfolioMutation,
  useGetBuilderPortfolioQuery,
  useEditBuilderPortfolioMutation,
} = builderApi;
