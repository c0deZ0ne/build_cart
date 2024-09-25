import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const registerBuilderApi = createApi({
  reducerPath: "registerApi",
  baseQuery: fetchBaseQuery({
    // base url of backend API
    baseUrl: process.env.REACT_APP_SERVER_ENDPOINT,
  }),
  endpoints: (builder) => ({
    registerBuilder: builder.mutation({
      query(data) {
        const { invitationId, projectId } = data;

        const url = `/builder/register?invitationId=${
          invitationId ?? ""
        }&projectId=${projectId ?? ""}`;

        return {
          url: url,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const { useRegisterBuilderMutation } = registerBuilderApi;
