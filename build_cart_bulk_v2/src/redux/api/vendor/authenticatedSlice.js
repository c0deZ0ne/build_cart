import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApiVendor = createApi({
  reducerPath: 'updateVendorAccount',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_SERVER_ENDPOINT,
    tagTypes: ['Vendor'],
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userState.user.data.token;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        return headers;
      }
    },
  }),

  // UPDATE ACCOUNT
  endpoints: builder => ({
    updateVendorAccount: builder.mutation({
      query(data) {
        return {
          url: 'vendor/account/profile',
          method: 'PATCH',
          body: data,
        };
      },
    }),

    // GET PROFILE
    // getVendorProfile: builder.query({
    //   query() {
    //     return {
    //       url: "vendor/account/profile",
    //     };
    //   },
    // }),
  }),
});

export const {
  useUpdateVendorAccountMutation,
  useGetVendorProfileQuery,
} = authApiVendor;
