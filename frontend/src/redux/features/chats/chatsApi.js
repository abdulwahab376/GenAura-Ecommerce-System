// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const chatsApi = createApi({
//     reducerPath: 'chatsApi',
//     baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/chats' }),
//     tagTypes: ['Chat'],
//     endpoints: (builder) => ({
//         getChatById: builder.query({
//             query: (id) => `/${id}`,
//             providesTags: (result, error, id) => [{ type: 'Chat', id }],
//             pollingInterval: 2000, //  Real-time: Refresh every 2 seconds
//         }),
//         sendMessage: builder.mutation({
//             query: ({ id, message }) => ({
//                 url: `/${id}/message`,
//                 method: 'POST',
//                 body: { message },
//             }),
//             invalidatesTags: (result, error, { id }) => [{ type: 'Chat', id }],
//         }),
//         updateChatStatus: builder.mutation({
//             query: ({ id, status, adminMessage }) => ({
//                 url: `/${id}/status`,
//                 method: 'PATCH',
//                 body: { status, adminMessage },
//             }),
//             invalidatesTags: (result, error, { id }) => [{ type: 'Chat', id }],
//         }),
//     }),
// });

// export const { useGetChatByIdQuery, useSendMessageMutation, useUpdateChatStatusMutation } = chatsApi;



import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chatsApi = createApi({
    reducerPath: 'chatsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/chats' }),
    tagTypes: ['Chat'],
    endpoints: (builder) => ({
        getChatById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Chat', id }],
            pollingInterval: 2000, 
        }),
        sendMessage: builder.mutation({
            query: ({ id, message }) => ({
                url: `/${id}/message`,
                method: 'POST',
                body: { message },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Chat', id }],
        }),
        // 🚀 Naya Endpoint: Message Delete karne ke liye
        deleteMessage: builder.mutation({
            query: ({ orderId, messageId }) => ({
                url: `/${orderId}/message/${messageId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { orderId }) => [{ type: 'Chat', id: orderId }],
        }),
        // 🚀 Naya Endpoint: Message Edit/Update karne ke liye
        updateMessage: builder.mutation({
            query: ({ orderId, messageId, message }) => ({
                url: `/${orderId}/message/${messageId}`,
                method: 'PATCH',
                body: { message },
            }),
            invalidatesTags: (result, error, { orderId }) => [{ type: 'Chat', id: orderId }],
        }),
        updateChatStatus: builder.mutation({
            query: ({ id, status, adminMessage }) => ({
                url: `/${id}/status`,
                method: 'PATCH',
                body: { status, adminMessage },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Chat', id }],
        }),
    }),
});

export const { 
    useGetChatByIdQuery, 
    useSendMessageMutation, 
    useUpdateChatStatusMutation,
    useDeleteMessageMutation, // 👈 Ye export kiya
    useUpdateMessageMutation   // 👈 Ye export kiya
} = chatsApi;