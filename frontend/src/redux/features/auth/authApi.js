// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { getBaseUrl } from "../../../utils/baseURL";

// export const authApi = createApi({
//   reducerPath: "authApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${getBaseUrl()}/api/auth`,
//     credentials: "include",
//   }),
//   endpoints: (builder) => ({
//     registerUser: builder.mutation({
//       query: (newUser) => ({
//         url: "/register",
//         method: "POST",
//         body: newUser,
//       }),
//     }),
//     loginUser: builder.mutation({
//       query: (credentials) => ({
//         url: "/login",
//         method: "POST",
//         body: credentials,
//       }),
//     }),
//     // ✅ NEW: Google Login Endpoint
//     googleLogin: builder.mutation({
//       query: (googleData) => ({
//         url: "/google-login",
//         method: "POST",
//         body: googleData,
//       }),
//     }),
//     logoutUser: builder.mutation({
//       query: () => ({
//         url: "/logout",
//         method: "POST",
//       }),
//     }),
//     getUser: builder.query({
//       query: () => ({
//         url: "/users",
//         method: "GET",
//       }),
//       refetchOnMount: true,
//       invalidatesTags: ["User"],
//     }),
//     deleteUser: builder.mutation({
//       query: (userId) => ({
//         url: `/users/${userId}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["User"],
//     }),
//     updateUserRole: builder.mutation({
//       query: ({ userId, role }) => ({
//         url: `/users/${userId}`,
//         method: "PUT",
//         body: { role },
//       }),
//       refetchOnMount: true,
//       invalidatesTags: ["User"],
//     }),
//     editProfile: builder.mutation({
//       query: (profileData) => ({
//         url: '/edit-profile',
//         method: 'PATCH',
//         body: profileData,
//       }),
//     }),
//   }),
// });

// // ✅ Exporting the new hook: useGoogleLoginMutation
// export const {
//   useRegisterUserMutation,
//   useLoginUserMutation,
//   useGoogleLoginMutation, 
//   useLogoutUserMutation,
//   useGetUserQuery,
//   useDeleteUserMutation,
//   useUpdateUserRoleMutation,
//   useEditProfileMutation
// } = authApi;

// export default authApi;


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/auth`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (newUser) => ({
        url: "/register",
        method: "POST",
        body: newUser,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    // ✅ NEW: Google Login Endpoint
    googleLogin: builder.mutation({
      query: (googleData) => ({
        url: "/google-login",
        method: "POST",
        body: googleData,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      refetchOnMount: true,
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: { role },
      }),
      refetchOnMount: true,
      invalidatesTags: ["User"],
    }),
    editProfile: builder.mutation({
      query: (profileData) => ({
        url: '/edit-profile',
        method: 'PATCH',
        body: profileData,
      }),
    }),
    // 🚀 NEW: Promotional Email Mutation
    sendPromoEmail: builder.mutation({
      query: (emailData) => ({
        url: '/send-promo-email',
        method: 'POST',
        body: emailData,
      }),
    }),
  }),
});

// ✅ Exporting hooks including the new one
export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGoogleLoginMutation, 
  useLogoutUserMutation,
  useGetUserQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useEditProfileMutation,
  useSendPromoEmailMutation // 👈 Use this hook in your Admin component
} = authApi;

export default authApi;