import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  // base url of backend API
  baseUrl: process.env.REACT_APP_SERVER_ENDPOINT,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().userState.user.data.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
      return headers;
    }
  },
});

export const api = createApi({
  reducerPath: "cutstructApi",
  baseQuery: baseQuery,
  // NOTE: Include tag types if needed
  endpoints: (api) => ({
    getAllMetrics: api.query({
      query({ pageSize }) {
        return {
          url: "/product/metrics/get-metrics",
          page_size: pageSize,
        };
      },
    }),

    getAllSpecifications: api.query({
      query({ pageSize }) {
        return {
          url: "/product/specification/get-specifications",
          params: {
            page_size: pageSize,
          },
        };
      },
    }),
  }),
});

export const { useGetAllMetricsQuery, useGetAllSpecificationsQuery } = api;
