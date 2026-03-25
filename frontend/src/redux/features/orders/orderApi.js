import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/baseURL';

export const orderApi = createApi({
  reducerPath: 'orderApi',

  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    credentials: "include",
  }),

  tagTypes: ["Order"],

  endpoints: (builder) => ({

    //  CREATE ORDER (Cash on Delivery)
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/create-order",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),

    //  Get orders by user email
    getOrdersByEmail: builder.query({
      query: (email) => ({
        url: `/${email}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    //  Get single order
    getOrderById: builder.query({
      query: (id) => ({
        url: `/order/${id}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    //  Admin: get all orders
    getAllOrders: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    //  Admin: update order status
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/update-order-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),

    //  Admin: delete order
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/delete-order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),

  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersByEmailQuery,
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApi;

export default orderApi;