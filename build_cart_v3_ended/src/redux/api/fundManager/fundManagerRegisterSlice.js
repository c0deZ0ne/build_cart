import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const registerFundManagerApi = createApi({
  reducerPath: "registerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_SERVER_ENDPOINT,
  }),
  endpoints: (fundManager) => ({
    registerFundManager: fundManager.mutation({
      query(data) {
        const { invitationId, projectId } = data;
        return {
          url: `/fundManager/register?invitationId=${
            invitationId ?? ""
          }&projectId=${projectId ?? ""}`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const { useRegisterFundManagerMutation } = registerFundManagerApi;
