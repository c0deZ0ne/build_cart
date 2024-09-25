import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const vendorSettingsApi = createApi({
  reducerPath: "vendorSettingsApi",
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
  endpoints: (vendor) => ({
    getProfileDetails: vendor.query({
      query: (arg) => ({ url: "/vendor/account/profile" }),
      transformResponse: (response, meta, arg) => response.data,
    }),
    updateProfileDetails: vendor.mutation({
      query(data) {
        return {
          url: "/vendor/account/profile",
          method: "PATCH",
          body: data,
        };
      },
    }),
    getBnak: vendor.query({
      query: () => ({
        url: "/bank",
        method: "GET",
        params: { page_size: 1000 },
      }),
    }),
    getAccountName: vendor.mutation({
      query: (data) => ({
        url: "/bank/resolve",
        method: "POST",
        body: data,
      }),
    }),
    saveBankDetails: vendor.mutation({
      query: (data) => ({
        url: "/vendor/account/bank",
        method: "PUT",
        body: data,
      }),
    }),
    getUserBankDetails: vendor.query({
      query: (arg) => ({ url: "/vendor/account/bank" }),
    }),
  }),
});

export const {
  useGetProfileDetailsQuery,
  useUpdateProfileDetailsMutation,
  useGetBnakQuery,
  useGetAccountNameMutation,
  useSaveBankDetailsMutation,
  useGetUserBankDetailsQuery,
} = vendorSettingsApi;
