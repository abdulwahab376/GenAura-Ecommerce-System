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
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:5000/api' 
    }),
    tagTypes: ['Chats'], 
    endpoints: (builder) => ({
        // 1. Get Chat - Pure chat data ko id ke sath tag kiya hai
        getChatById: builder.query({
            query: (id) => `/chats/${id}`,
            providesTags: (result, error, id) => [{ type: 'Chats', id }, 'Chats'],
        }),
        
        // 2. Mark as Read
        markAsRead: builder.mutation({
            query: (orderId) => ({
                url: `/chats/mark-as-read/${orderId}`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, error, orderId) => [{ type: 'Chats', id: orderId }],
        }),

        // 3. Send Message
        sendMessage: builder.mutation({
            query: ({ id, message }) => ({
                url: `/chats/${id}/message`,
                method: 'POST',
                body: { message },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Chats', id: id }, 'Chats'],
        }),

        // 4. Update Status (Approve/Reject)
        updateChatStatus: builder.mutation({
            query: ({ id, status, adminMessage }) => ({
                url: `/chats/${id}/status`,
                method: 'PATCH',
                body: { status, adminMessage },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Chats', id: id }, 'Chats'],
        }),

        // 5. Delete Message
        deleteMessage: builder.mutation({
            query: ({ orderId, messageId }) => ({
                url: `/chats/${orderId}/message/${messageId}`,
                method: 'DELETE',
            }),
            // Force refresh for both specific ID and general list
            invalidatesTags: (result, error, { orderId }) => [
                { type: 'Chats', id: orderId },
                'Chats'
            ],
        }),

        // 6. Edit Message - Fixed to force UI update
        updateMessage: builder.mutation({
            query: ({ orderId, messageId, message }) => ({
                url: `/chats/${orderId}/message/${messageId}`,
                method: 'PATCH',
                body: { message }, 
            }),
            // Yahan humne list aur specific chat dono ko refresh karne ka signal diya hai
            invalidatesTags: (result, error, { orderId }) => [
                { type: 'Chats', id: orderId },
                'Chats'
            ],
        }),
    }),
});

export const { 
    useGetChatByIdQuery, 
    useMarkAsReadMutation, 
    useSendMessageMutation, 
    useUpdateChatStatusMutation,
    useDeleteMessageMutation,
    useUpdateMessageMutation 
} = chatsApi;