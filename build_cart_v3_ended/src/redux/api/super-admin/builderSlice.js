import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const SuperAdminBuilderApi = createApi({
  reducerPath: "SuperAdminBuilderApi",
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
  endpoints: (builder) => ({
    getAllBuildersUnpaginated: builder.query({
      query: () => ({
        url: "/superAdmin/builders",
        method: "GET",
        params: { page_size: 1000 },
      }),
    }),
    getAllBuilders: builder.query({
      query: () => ({
        url: "/superAdmin/builders",
        method: "GET",
      }),
    }),

    createBuilder: builder.mutation({
      query(data) {
        return {
          url: "/superAdmin/builders",
          method: "POST",
          body: data,
        };
      },
      transformResponse: (response, meta, arg) => response.data,
    }),

    updateBuilder: builder.mutation({
      query(data) {
        const { id, payload } = data;
        return {
          url: `/superAdmin/builders/${id}/profile`,
          method: "PATCH",
          body: payload,
        };
      },
    }),

    addProcurementManToBuilder: builder.mutation({
      query(data) {
        const { builderId, procurementManagerId } = data;
        return {
          url: `/superAdmin/builders/${builderId}/procurementManagers`,
          method: "PATCH",
          params: { procurementManagerUserId: procurementManagerId },
        };
      },
    }),

    createBuilderProject: builder.mutation({
      query(data) {
        const { id, payload } = data;
        return {
          url: `/superAdmin/builders/${id}/projects`,
          method: "POST",
          body: payload,
        };
      },
      transformResponse: (response, meta, arg) => response.data,
    }),

    getAllProjects: builder.query({
      query: () => ({
        url: "/superAdmin/builders/projects",
        method: "GET",
        params: { page_size: 1000 },
      }),
    }),

    uploadMaterialSchedule: builder.mutation({
      query(data) {
        return {
          url: "/superAdmin/builder/material-schedule-upload",
          method: "POST",
          body: data,
        };
      },
      transformResponse: (response, meta, arg) => response.data,
    }),

    getBuilder: builder.query({
      query: (builderId) => ({
        url: `/superAdmin/builders/${builderId}`,
        method: "GET",
      }),
    }),

    getBuilderProjects: builder.query({
      query: (builderId) => ({
        url: `/superAdmin/projects/builders/${builderId}`,
        method: "GET",
      }),
    }),

    getBuilderOrders: builder.query({
      query: (builderId) => ({
        url: `/superAdmin/orders/${builderId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllBuildersUnpaginatedQuery,
  useGetAllBuildersQuery,
  useAddProcurementManToBuilderMutation,
  useCreateBuilderMutation,
  useUpdateBuilderMutation,
  useCreateBuilderProjectMutation,
  useGetAllProjectsQuery,
  useUploadMaterialScheduleMutation,
  useGetBuilderQuery,
  useGetBuilderOrdersQuery,
  useGetBuilderProjectsQuery,
} = SuperAdminBuilderApi;
