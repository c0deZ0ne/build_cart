import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const SuperAdminVendorApi = createApi({
  reducerPath: "SuperAdminVendorApi",
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
  endpoints: (vendor) => ({
    getAllVendorsUnpaginated: vendor.query({
      query: () => ({
        url: "/superAdmin/vendors",
        method: "GET",
        params: { page_size: 1000 },
      }),
    }),
    getAllVendors: vendor.query({
      query: () => ({
        url: "/superAdmin/vendors",
        method: "GET",
      }),
    }),

    createVendor: vendor.mutation({
      query(data) {
        return {
          url: "/superAdmin/vendors/invite",
          method: "POST",
          body: data,
        };
      },
      transformResponse: (response, meta, arg) => response.data,
    }),

    updateVendor: vendor.mutation({
      query(data) {
        const { id, payload } = data;
        return {
          url: `/superAdmin/vendors/${id}/profile`,
          method: "PATCH",
          body: payload,
        };
      },
    }),

    addProcurementManToVendor: vendor.mutation({
      query(data) {
        const { vendorId, procurementManagerId } = data;
        return {
          url: `/superAdmin/vendors/${vendorId}/procurementManagers`,
          method: "PATCH",
          params: { procurementManagerId: procurementManagerId },
        };
      },
    }),

    getVendor: vendor.query({
      query: (vendorId) => ({
        url: `/superAdmin/vendors/${vendorId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllVendorsUnpaginatedQuery,
  useGetAllVendorsQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useAddProcurementManToVendorMutation,
  useGetVendorQuery,
} = SuperAdminVendorApi;
