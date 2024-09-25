import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
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

  // GET VENDORS
  endpoints: (product) => ({
    getAllProductCategories: product.query({
      query() {
        return {
          url: "/product/categories/get-categories?page_size=100",
        };
      },
    }),

    getProductsByCategory: product.query({
      query(id) {
        return {
          url: `/product/category/${id}?page_size=100`,
        };
      },
    }),
  }),
});

export const {
  useGetAllProductCategoriesQuery,
  useGetProductsByCategoryQuery,
} = productsApi;
