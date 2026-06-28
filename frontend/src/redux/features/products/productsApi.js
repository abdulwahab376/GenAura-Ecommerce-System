// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { getBaseUrl } from "../../../utils/baseURL";

// export const productsApi = createApi({
//   reducerPath: "productsApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${getBaseUrl()}/api/products`,
//     credentials: "include",
//   }),
//   tagTypes: ["Products"],
//   endpoints: (builder) => ({
//     fetchAllProducts: builder.query({
//         query: ({ category, color, minPrice, maxPrice, page = 1, limit = 10 }) => {
//             const queryParams = new URLSearchParams({
//                 category: category || '',
//                 color: color || '',
//                 minPrice: minPrice || 0,
//                 maxPrice: maxPrice || '',
//                 page: page.toString(), 
//                 limit: limit.toString()
//             }).toString();
    
//             return `/?${queryParams}`;
//         },
//         providesTags: ["Products"],
//     }),

//     // fetchProductById wala hissa sirf update karein
// fetchProductById: builder.query({
//   query: (id) => `/${id}`, // Ensure karein ke baseUrl ke baad sahi slash lage
//   providesTags: (result, error, id) => [{ type: "Products", id }],
// }),

//     AddProduct: builder.mutation({
//         query: (newProduct) => ({
//           url: "/create-product",
//           method: "POST",
//           body: newProduct,
//           credentials: "include",
//         }),
//         invalidatesTags: ["Products"],
//       }),

//     fetchRelatedBlogs: builder.query({
//       query: (id) => `blogs/related/${id}`,
//     }),

//     updateProduct: builder.mutation({
//       query: ({ id, ...rest }) => ({
//         url: `update-product/${id}`,
//         method: "PATCH",
//         body: rest,
//         credentials: "include",
//       }),
//       invalidatesTags: ["Products"],
//     }),

//     deleteProduct: builder.mutation({
//       query: (id) => ({
//         url: `/${id}`,
//         method: "DELETE",
//         credentials: "include",
//       }),
//       invalidatesTags: (result, error, id) => [{ type: "Products", id }],
//     }),
//   }),
// });

// export const {
//   useFetchAllProductsQuery,
//   useFetchProductByIdQuery,
//   useAddProductMutation,
//   useUpdateProductMutation,
//   useDeleteProductMutation,
//   useFetchRelatedBlogsQuery,
// } = productsApi;

// export default productsApi;



import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/products`,
    credentials: "include",
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    fetchAllProducts: builder.query({
        // Alag se mainCategory parameter add kiya hai
        query: ({ category, mainCategory, color, minPrice, maxPrice, page = 1, limit = 10 }) => {
            const queryParams = new URLSearchParams({
                category: category || '',
                mainCategory: mainCategory || '', // Yeh backend ko bataye ga ke Men/Women/Kids filter karna hai
                color: color || '',
                minPrice: minPrice || 0,
                maxPrice: maxPrice || '',
                page: page.toString(), 
                limit: limit.toString()
            }).toString();
    
            return `/?${queryParams}`;
        },
        providesTags: ["Products"],
    }),

    fetchProductById: builder.query({
      query: (id) => `/${id}`, 
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    AddProduct: builder.mutation({
        query: (newProduct) => ({
          url: "/create-product",
          method: "POST",
          body: newProduct,
          credentials: "include",
        }),
        invalidatesTags: ["Products"],
      }),

    fetchRelatedBlogs: builder.query({
      query: (id) => `blogs/related/${id}`,
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `update-product/${id}`,
        method: "PATCH",
        body: rest,
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Products", id }],
    }),
  }),
});

export const {
  useFetchAllProductsQuery,
  useFetchProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFetchRelatedBlogsQuery,
} = productsApi;

export default productsApi;
