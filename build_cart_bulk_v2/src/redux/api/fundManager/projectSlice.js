import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

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
          url: "/fundManager/project",
          method: "POST",
          body: data,
        };
      },
    }),

    updateProject: project.mutation({
      query(data) {
        const { payload, projectId } = data;
        return {
          url: `/fundManager/project/${projectId}/edit`,
          method: "PATCH",
          body: payload,
        };
      },
    }),

    getProjects: project.query({
      query: (status) => {
        return {
          url: `/fundManager/all-projects?page_size=100`,
          method: "GET",
          params: { status },
        };
      },
    }),

    getProjectsStat: project.query({
      query: () => "fundmanager/project/dashboard",
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
  useGetProjectsStatQuery,
} = projectApi;
