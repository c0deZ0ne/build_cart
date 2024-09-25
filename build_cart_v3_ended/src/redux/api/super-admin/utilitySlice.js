import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const SuperAdminUtilityApi = createApi({
  reducerPath: "SuperAdminUtilityApi",
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
  endpoints: (utility) => ({
    getAllRoles: utility.query({
      query: () => "/superAdmin/roles",
    }),

    getAllProcurementManager: utility.query({
      query: (roleId) => ({
        url: `/superAdmin/procurementManagers/${roleId}`,
        method: "GET",
        params: { page_size: 1000 },
      }),
    }),
  }),
});

export const { useGetAllRolesQuery, useGetAllProcurementManagerQuery } =
  SuperAdminUtilityApi;
