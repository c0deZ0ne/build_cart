import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const superAdminApi = createApi({
  reducerPath: "superAdminApi",
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

  endpoints: (superAdminApi) => ({
    createCategoryAndProducts: superAdminApi.mutation({
      query(data) {
        return {
          url: "/superAdmin/products",
          method: "POST",
          body: data,
        };
      },
    }),

    getAllProductCategories: superAdminApi.query({
      query() {
        return {
          url: "/superAdmin/products/category",
          method: "GET",
        };
      },
    }),

    pauseACategory: superAdminApi.mutation({
      query({ categoryId, visibility }) {
        return {
          url: `/superAdmin/categories/${categoryId}`,
          params: { visibility },
          method: "PATCH",
        };
      },
    }),

    pauseAProduct: superAdminApi.mutation({
      query({ productId, visibility }) {
        return {
          url: `/superAdmin/products/${productId}`,
          params: { visibility },
          method: "PATCH",
        };
      },
    }),

    fetchProductsByCategory: superAdminApi.query({
      query(categoryId) {
        return {
          url: `/superAdmin/products/category/${categoryId}`,
          method: "GET",
        };
      },
    }),

    updateAProduct: superAdminApi.mutation({
      query({ productId, data }) {
        return {
          url: `/superAdmin/products/${productId}/update`,
          method: "PATCH",
          body: data,
        };
      },
    }),

    fetchPayouts: superAdminApi.query({
      query() {
        return {
          url: "/superAdmin/payouts",
          method: "GET",
        };
      },
    }),

    getDashboardData: superAdminApi.query({
      query() {
        return {
          url: "/superAdmin/dashboard",
        };
      },
    }),

    getLogs: superAdminApi.query({
      query() {
        return {
          url: "/superAdmin/userLogs",
        };
      },
    }),
    getTransactions: superAdminApi.query({
      query() {
        return {
          url: "/superAdmin/transactions",
        };
      },
    }),

    getAllRevenues: superAdminApi.query({
      query() {
        return {
          url: "/superAdmin/revenue",
        };
      },
    }),

    getProfile: superAdminApi.query({
      query() {
        return {
          url: "/superAdmin/profile",
          method: "GET",
        };
      },
    }),

    updateProfile: superAdminApi.mutation({
      query({ data }) {
        return {
          url: "/superAdmin/profile",
          method: "PATCH",
          body: data,
        };
      },
    }),

    addMemberToTeam: superAdminApi.mutation({
      query(data) {
        return {
          url: "/superAdmin/teams",
          method: "POST",
          body: data,
        };
      },
    }),
    getTeamMembers: superAdminApi.query({
      query({ teamId }) {
        return {
          url: `/superAdmin/teams/${teamId}`,
          method: "GET",
        };
      },
    }),

    pauseOrUnpause: superAdminApi.mutation({
      query({ teamId, teamMemberUserId, status }) {
        return {
          url: `/superAdmin/update-member-status/${teamId}/${teamMemberUserId}`,
          method: "PATCH",
          params: { status: status },
        };
      },
    }),

    deleteTeamMember: superAdminApi.mutation({
      query({ teamId, teamMemberUserId }) {
        return {
          url: `/superAdmin/delete-team-member/${teamMemberUserId}/${teamId}`,
          method: "DELETE",
        };
      },
    }),

    editTeamMemberDetails: superAdminApi.mutation({
      query({ teamId, teamMemberUserId, data }) {
        return {
          url: `/superAdmin/${teamMemberUserId}/${teamId}`,
          method: "PATCH",
          body: data,
        };
      },
    }),

    getLogsForASpecificUser: superAdminApi.query({
      query({ userId }) {
        return {
          url: `/superAdmin/userLogs/users/${userId}`,
        };
      },
    }),

    getCommissionPercentage: superAdminApi.query({
      query() {
        return {
          url: "/superAdmin/commissions",
        };
      },
    }),

    addCommissionPercentage: superAdminApi.mutation({
      query({ percentageNumber }) {
        return {
          url: "/superAdmin/commissions",
          method: "POST",
          body: { percentageNumber },
        };
      },
    }),

    updateCommissionPercentage: superAdminApi.mutation({
      query({ percentageNumber, active, commissionId }) {
        return {
          url: `/superAdmin/commissions/${commissionId}`,
          method: "PATCH",
          body: {
            percentageNumber,
            active,
          },
        };
      },
    }),
  }),
});

export const {
  useGetAllProductCategoriesQuery,
  useFetchProductsByCategoryQuery,
  useFetchPayoutsQuery,
  useGetDashboardDataQuery,
  useGetLogsQuery,
  useGetTransactionsQuery,
  useGetAllRevenuesQuery,
  useGetProfileQuery,
  useGetTeamMembersQuery,
  useGetLogsForASpecificUserQuery,
  useGetCommissionPercentageQuery,
  useUpdateProfileMutation,
  useCreateCategoryAndProductsMutation,
  usePauseACategoryMutation,
  usePauseAProductMutation,
  useUpdateAProductMutation,
  useAddMemberToTeamMutation,
  usePauseOrUnpauseMutation,
  useDeleteTeamMemberMutation,
  useEditTeamMemberDetailsMutation,
  useAddCommissionPercentageMutation,
  useUpdateCommissionPercentageMutation,
} = superAdminApi;
