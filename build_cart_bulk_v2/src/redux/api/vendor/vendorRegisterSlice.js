import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const registerVendorApi = createApi({
  reducerPath: "registerApi",
  baseQuery: fetchBaseQuery({
    // base url of backend API
    baseUrl: process.env.REACT_APP_SERVER_ENDPOINT,
  }),
  endpoints: (builder) => ({
    registerVendor: builder.mutation({
      query(data) {
        const { invitationId, projectId } = data;
        return {
          url: `/vendor?invitationId=${invitationId ?? ""}&projectId=${
            projectId ?? ""
          }`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const { useRegisterVendorMutation } = registerVendorApi;
