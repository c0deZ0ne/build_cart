import {api} from "../api";

const settingsApi = api.injectEndpoints({
    endpoints: (build) => ({
        getProfileDetails: build.query({
            query: (arg) => ({ url: "/builder/profile"}),
            transformResponse: (response, meta, arg) => response.data
        }),
        updateProfileDetails: build.mutation({
            query(data) {
                return {
                    url: "/builder/profile",
                    method: "PATCH",
                    body: data
                }
            }
        })
    })
})

export const { useGetProfileDetailsQuery, useUpdateProfileDetailsMutation } = settingsApi