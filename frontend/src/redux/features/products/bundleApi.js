import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/baseUrl'; // Path check kar lain (ek step aur piche jana paray ga)

export const bundleApi = createApi({
    reducerPath: 'bundleApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${getBaseUrl()}/api/bundles`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Bundles'],
    endpoints: (builder) => ({
        getBundles: builder.query({
            query: () => '/',
            providesTags: ['Bundles'],
        }),
        addBundle: builder.mutation({
            query: (newBundle) => ({
                url: '/add-bundle',
                method: 'POST',
                body: newBundle,
            }),
            invalidatesTags: ['Bundles'],
        }),
        deleteBundle: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Bundles'],
        }),
    }),
});

export const { 
    useGetBundlesQuery, 
    useAddBundleMutation, 
    useDeleteBundleMutation 
} = bundleApi;