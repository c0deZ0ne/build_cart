import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const registerUserApi = createApi({
  reducerPath: "registerApi",
  baseQuery: fetchBaseQuery({
    // base url of backend API
    baseUrl: process.env.REACT_APP_SERVER_ENDPOINT,
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query(data) {
        return {
          url: "/user/register",
          method: "POST",
          body: data,
        };
      },
    }),

    registerUserFromSSO: builder.mutation({
      query(data) {
        return {
          url: "/user/register-user-with-sso",
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const { useRegisterUserMutation, useRegisterUserFromSSOMutation } =
  registerUserApi;
