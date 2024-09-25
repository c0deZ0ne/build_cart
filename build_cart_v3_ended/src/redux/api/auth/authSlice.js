import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { setUserCredentials } from "../../features/user/userSlice";
import { daysDiff } from "../../../utility/helpers";

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({
    // base url of backend API
    baseUrl: process.env.REACT_APP_SERVER_ENDPOINT,
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query(data) {
        return {
          url: "auth/login",
          method: "POST",
          body: data,
        };
      },
      // transformResponse: data => data.data,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          let isSubscribe = false;
          let showSubscriptionCounter = false;
          isSubscribe = true;
          if (data.data.subscription) {
            isSubscribe = true;
            let days = daysDiff(
              new Date(),
              data.data?.subscription?.expirationDate,
            );

            showSubscriptionCounter = days <= 14 ? true : false;
          }

          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              ...data.data,
              isSubscribe,
              showSubscriptionCounter,
            }),
          );
          localStorage.setItem("token", data.data.token);
          dispatch(setUserCredentials({ ...data }));
        } catch (error) {}
      },
    }),

    loginUserWithSSO: builder.mutation({
      query(data) {
        return {
          url: "auth/login-with-sso",
          method: "POST",
          body: data,
        };
      },
      // transformResponse: data => data.data,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          localStorage.setItem("userInfo", JSON.stringify(data.data));
          localStorage.setItem("token", data.data.token);
          dispatch(setUserCredentials(data));
        } catch (error) {}
      },
    }),

    verifyEmailotp: builder.mutation({
      query(data) {
        return {
          url: "user/verify-email",
          method: "PATCH",
          body: data,
        };
      },
    }),

    forgotPassword: builder.mutation({
      query(email) {
        return {
          url: `user/request-reset-password/${email}`,
          method: "POST",
          body: email,
        };
      },
    }),

    resetPasswordWithOtp: builder.mutation({
      query({ email, password, resetPasswordOtp }) {
        return {
          url: `user/reset-password`,
          method: "PATCH",
          body: { email, password, resetPasswordOtp },
        };
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useLoginUserWithSSOMutation,
  useVerifyEmailotpMutation,
  useForgotPasswordMutation,
  useResetPasswordWithOtpMutation,
} = loginApi;
