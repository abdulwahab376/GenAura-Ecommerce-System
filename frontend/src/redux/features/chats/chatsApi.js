import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chatsApi = createApi({
    reducerPath: 'chatsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/chats' }),
    tagTypes: ['Chat'],
    endpoints: (builder) => ({
        getChatById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Chat', id }],
            pollingInterval: 2000, //  Real-time: Refresh every 2 seconds
        }),
        sendMessage: builder.mutation({
            query: ({ id, message }) => ({
                url: `/${id}/message`,
                method: 'POST',
                body: { message },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Chat', id }],
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

export const { useGetChatByIdQuery, useSendMessageMutation, useUpdateChatStatusMutation } = chatsApi;