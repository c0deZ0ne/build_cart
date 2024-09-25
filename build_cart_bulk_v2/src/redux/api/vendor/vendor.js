import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const vendorApi = createApi({
  reducerPath: "vendorApi",
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
  endpoints: (vendor) => ({
    addProductsToVendor: vendor.mutation({
      query(products) {
        return {
          url: "/vendor-product/add-products",
          method: "PATCH",
          body: { products: products },
        };
      },
    }),

    getVendorProducts: vendor.query({
      query(search) {
        return {
          url: "/vendor-product?page_size=100",
          method: "GET",
          params: { searchParam: search.trim() },
        };
      },
    }),

    removeProductFromVendor: vendor.mutation({
      query(data) {
        return {
          url: "/vendor-product/remove-products",
          method: "PATCH",
          body: {
            productsIDs: data,
          },
        };
      },
    }),

    removeSpecFromProduct: vendor.mutation({
      query(id) {
        return {
          url: `vendor-product/delete-vendor-product-specification/${id}`,
          method: "DELETE",
        };
      },
    }),

    updateProductVisibility: vendor.mutation({
      query(id) {
        return {
          url: `/vendor-product/update-product-visibility/${id}`,
          method: "PATCH",
        };
      },
    }),

    getUnfufilledOrder: vendor.query({
      query(searchTerm) {
        return {
          url: "/vendor/bidboard/unfulfilled-orders?page_size=100",
          method: "GET",
          params: { search: searchTerm.trim() },
        };
      },
    }),

    getActiveOrders: vendor.query({
      query(searchTerm) {
        return {
          url: "/vendor/bidboard/active-orders?page_size=100",
          method: "GET",
          params: { search: searchTerm },
        };
      },
    }),

    getCompletedOrders: vendor.query({
      query(searchTerm) {
        return {
          url: "/vendor/bidboard/completed-orders?page_size=100",
          params: { search: searchTerm.trim() },
        };
      },
    }),

    getDisputedOrders: vendor.query({
      query(searchTerm) {
        return {
          url: "/vendor/bidboard/disputed-orders?page_size=100",
          method: "GET",
          params: { search: searchTerm.trim() },
        };
      },
    }),

    rateAnOrder: vendor.mutation({
      query({ contractId, data }) {
        return {
          url: `/vendor/bidboard/${contractId}/rate-order`,
          method: "POST",
          body: data,
        };
      },
    }),

    openDisputeOnOrder: vendor.mutation({
      query({ contractId, data }) {
        return {
          url: `/vendor/bidboard/${contractId}/open-dispute`,
          method: "POST",
          body: data,
        };
      },
    }),

    dispatchOrderToDestination: vendor.mutation({
      query({ contractId, deliveryScheduleId, startDate, endDate }) {
        return {
          url: `/vendor/contract/${contractId}/dispatch/${deliveryScheduleId}`,
          method: "PATCH",
          body: { startDeliveryDate: startDate, endDeliveryDate: endDate },
        };
      },
    }),

    confirmDelivery: vendor.mutation({
      query({ contractId, deliveryScheduleId, data }) {
        return {
          url: `/vendor/contract/${contractId}/comfirm-delivery/${deliveryScheduleId}`,
          method: "POST",
          body: data,
          params: { contractId },
        };
      },
    }),
  }),
});

export const {
  useGetUnfufilledOrderQuery,
  useGetVendorProductsQuery,
  useGetActiveOrdersQuery,
  useGetCompletedOrdersQuery,
  useGetDisputedOrdersQuery,
  useAddProductsToVendorMutation,
  useDispatchOrderToDestinationMutation,
  useConfirmDeliveryMutation,
  useRateAnOrderMutation,
  useRemoveProductFromVendorMutation,
  useRemoveSpecFromProductMutation,
  useUpdateProductVisibilityMutation,
  useOpenDisputeOnOrderMutation,
} = vendorApi;
