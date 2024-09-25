import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const changePasswordApi = createApi({
  reducerPath: "changePasswordApi",
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
  endpoints: (password) => ({
    changePassword: password.mutation({
      query(data) {
        return {
          url: "/user/password",
          method: "PATCH",
          body: data,
        };
      },
    }),
  }),
});

export const { useChangePasswordMutation } = changePasswordApi;
