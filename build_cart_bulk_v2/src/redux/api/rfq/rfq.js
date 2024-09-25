import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rfqApi = createApi({
  reducerPath: "rfqApi",
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
  endpoints: (rfq) => ({
    getAllRfqCategories: rfq.query({
      query() {
        return {
          url: "/rfq/category",
          method: "GET",
        };
      },
    }),

    getAllItems: rfq.query({
      query() {
        return {
          url: "/rfq/item",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetAllRfqCategoriesQuery, useGetAllItemsQuery } = rfqApi;
