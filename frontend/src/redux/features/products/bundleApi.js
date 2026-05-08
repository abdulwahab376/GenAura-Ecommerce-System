import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/baseUrl'; 

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
        // 1. Get All Bundles
        getBundles: builder.query({
            query: () => '/',
            providesTags: ['Bundles'],
        }),

        // 2. Get Single Bundle (For Editing)
        getBundleById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Bundles', id }],
        }),

        // 3. Add New Bundle
        addBundle: builder.mutation({
            query: (newBundle) => ({
                url: '/add-bundle',
                method: 'POST',
                body: newBundle,
            }),
            invalidatesTags: ['Bundles'],
        }),

        // 4. Update Bundle (Edit Logic)
        updateBundle: builder.mutation({
            query: ({ id, ...updatedBundle }) => ({
                url: `/${id}`,
                method: 'PATCH', // Ya 'PUT' jo aapke backend mein set ho
                body: updatedBundle,
            }),
            invalidatesTags: ['Bundles'],
        }),

        // 5. Delete Bundle
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
    useGetBundleByIdQuery, // Naya Hook
    useAddBundleMutation, 
    useUpdateBundleMutation, // Naya Hook
    useDeleteBundleMutation 
} = bundleApi;