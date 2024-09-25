import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const projectApi = createApi({
  reducerPath: "projectApi",
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
  endpoints: (project) => ({
    createProject: project.mutation({
      query(data) {
        return {
          url: "/builder/project",
          method: "POST",
          body: data,
        };
      },
    }),

    updateProject: project.mutation({
      query(data) {
        const { id, payload } = data;
        return {
          url: `/builder/project/${id}/update`,
          method: "PATCH",
          body: payload,
        };
      },
    }),

    getProjects: project.query({
      query: () => "/builder/projects",
    }),

    getProjectsStat: project.query({
      query: () => "/builder/project/statistics",
    }),

    getFundmanagerProjectsStat: project.query({
      query: () => "/fundManager/projects/statistics",
    }),

    getProjectsInvitesSharedWithMe: project.query({
      query() {
        return {
          url: "/project-shares/invites/me",
        };
      },
    }),

    acceptProjectInvite: project.mutation({
      query(sharedId) {
        return {
          url: `/project-shares/${sharedId}/accept`,
          method: "PATCH",
        };
      },
    }),

    declineProjectInvite: project.mutation({
      query(sharedId) {
        return {
          url: `/project-shares/${sharedId}`,
          method: "DELETE",
        };
      },
    }),

    fetchBuilderFundmanagerProject: project.query({
      query(data) {
        return {
          url: `/builder/fund-manager-projects?page_size=100`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
  useGetProjectsStatQuery,
  useGetFundmanagerProjectsStatQuery,
  useGetProjectsInvitesSharedWithMeQuery,
  useDeclineProjectInviteMutation,
  useAcceptProjectInviteMutation,
  useFetchBuilderFundmanagerProjectQuery,
} = projectApi;
