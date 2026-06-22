// import React from 'react';
// import { createBrowserRouter } from 'react-router-dom';
// import App from '../App';
// import Home from '../pages/home/Home';
// import CategoryPage from '../pages/category/CategoryPage';
// import ShopPage from '../pages/shop/ShopPage';
// import ErrorPage from '../components/ErrorPage';
// import Search from '../pages/search/Search';
// import Login from '../components/Login';
// import Register from '../components/Register';

// import DashboardLayout from '../pages/dashboard/DashboardLayout';
// import PrivateRoute from './PrivateRoute';
// import SingleProduct from '../pages/shop/productdetais/SingleProduct';
// // 🚀 Naya Import: Single Bundle Detail Page
// import SingleBundle from '../pages/shop/productdetais/SingleBundle'; 
// import PaymentSuccess from '../components/PaymentSuccess';
// import UserOrders from '../pages/dashboard/user/UserOrders';
// import UserPayments from '../pages/dashboard/user/UserPayments';
// import OrderDetails from '../pages/dashboard/user/OrderDetails';
// import UserReviews from '../pages/dashboard/user/UserReviews';
// import UserProfile from '../pages/dashboard/user/UserProfile';
// import AdminDMain from '../pages/dashboard/admin/dashboard/AdminDMain';
// import UserDMain from '../pages/dashboard/user/dashboard/UserDMain';
// import AddProduct from '../pages/dashboard/admin/addProduct/AddProduct';
// import ManageProducts from '../pages/dashboard/admin/manageProduct/ManageProducts';
// import UpdateProduct from '../pages/dashboard/admin/manageProduct/UpdateProduct';
// import ManageUser from '../pages/dashboard/admin/users/ManageUser';
// import ManageOrders from '../pages/dashboard/admin/manageOrders/ManageOrders';
// import Contact from "../pages/contact/Contact";
// import CheckoutPage from '../pages/shop/CheckoutPage';
// import PaymentChat from '../pages/shop/PaymentChat';
// import AdminChats from '../pages/dashboard/admin/chat/AdminChats';
// import AdminChatDetail from '../pages/dashboard/admin/chat/AdminChatDetail';
// import CustomerPaymentChat from '../pages/dashboard/user/CustomerPaymentChat';

// // 🚀 Bundle Deals Components
// import AddBundle from '../pages/dashboard/admin/addProduct/AddBundle'; 
// import ManageBundles from '../pages/dashboard/admin/manageProduct/ManageBundles';
// import UpdateBundle from '../pages/dashboard/admin/manageProduct/UpdateBundle'; 

// // 🚀 Naya Import: Send Promo Email Page (Admin)
// import SendPromoEmail from '../pages/dashboard/admin/SendPromoEmail';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//     errorElement: <ErrorPage />,
//     children: [
//       { path: '/', element: <Home /> },
//       { path: '/categories/:categoryName', element: <CategoryPage /> },
//       { path: '/shop', element: <ShopPage /> },
//       { path: '/search', element: <Search /> },
//       { path: '/shop/:id', element: <SingleProduct /> },
//       // ✅ Naya Route: Jab Bundle par click ho
//       { path: '/bundles/:id', element: <SingleBundle /> }, 
//       { path: "/contact", element: <Contact /> },
//       { path: "/checkout", element: <CheckoutPage /> },
//       { path: "/payment-chat", element: <PaymentChat /> },
//       { path: "/success", element: <PaymentSuccess /> },
//       { path: "/orders/:orderId", element: <OrderDetails /> },
//     ],
//   },
//   { path: '/login', element: <Login /> },
//   { path: '/register', element: <Register /> },
//   {
//     path: '/dashboard',
//     element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
//     children: [
//       // 1. User/Customer Routes
//       { path: '', element: <UserDMain /> },
//       { path: 'orders', element: <UserOrders /> },
//       { path: 'payments', element: <UserPayments /> },
//       { path: 'profile', element: <UserProfile /> },
//       { path: 'reviews', element: <UserReviews /> },
//       { path: 'payment-support', element: <CustomerPaymentChat /> },
//       { path: 'payment-support/:id', element: <CustomerPaymentChat /> },

//       // 2. Admin Routes (Strictly Admin only)
//       {
//         path: 'admin',
//         element: <PrivateRoute role="admin"><AdminDMain /></PrivateRoute>,
//       },
//       {
//         path: 'add-new-post',
//         element: <PrivateRoute role="admin"><AddProduct /></PrivateRoute>,
//       },
//       // ✅ Add Hot Deal Route
//       {
//         path: 'add-bundle',
//         element: <PrivateRoute role="admin"><AddBundle /></PrivateRoute>,
//       },
//       // ✅ Manage Hot Deals Route
//       {
//         path: 'manage-bundles',
//         element: <PrivateRoute role="admin"><ManageBundles /></PrivateRoute>,
//       },
//       // ✅ Edit Hot Deal Route
//       {
//         path: 'edit-bundle/:id',
//         element: <PrivateRoute role="admin"><UpdateBundle /></PrivateRoute>,
//       },
//       {
//         path: 'manage-products',
//         element: <PrivateRoute role="admin"><ManageProducts /></PrivateRoute>,
//       },
//       {
//         path: 'update-product/:id',
//         element: <PrivateRoute role="admin"><UpdateProduct /></PrivateRoute>,
//       },
//       {
//         path: 'users',
//         element: <PrivateRoute role="admin"><ManageUser /></PrivateRoute>,
//       },
//       {
//         path: 'manage-orders',
//         element: <PrivateRoute role="admin"><ManageOrders /></PrivateRoute>,
//       },
//       {
//         path: 'chats',
//         element: <PrivateRoute role="admin"><AdminChats /></PrivateRoute>,
//       },
//       {
//         path: 'chats/:id',
//         element: <PrivateRoute role="admin"><AdminChatDetail /></PrivateRoute>,
//       },
//       // 🚀 Naya Route: Promotional Email Blast
//       {
//         path: 'send-promo',
//         element: <PrivateRoute role="admin"><SendPromoEmail /></PrivateRoute>,
//       }
//     ],
//   },
// ]);

// export default router;



import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/home/Home';
import CategoryPage from '../pages/category/CategoryPage';
import ShopPage from '../pages/shop/ShopPage';
import ErrorPage from '../components/ErrorPage';
import Search from '../pages/search/Search';
import Login from '../components/Login';
import Register from '../components/Register';
import ForgotPassword from '../components/ForgotPassword'; // ✅ Naya Import: Forgot Password component register kiya

import DashboardLayout from '../pages/dashboard/DashboardLayout';
import PrivateRoute from './PrivateRoute';
import SingleProduct from '../pages/shop/productdetais/SingleProduct';
// 🚀 Naya Import: Single Bundle Detail Page
import SingleBundle from '../pages/shop/productdetais/SingleBundle'; 
import PaymentSuccess from '../components/PaymentSuccess';
import UserOrders from '../pages/dashboard/user/UserOrders';
import UserPayments from '../pages/dashboard/user/UserPayments';
import OrderDetails from '../pages/dashboard/user/OrderDetails';
import UserReviews from '../pages/dashboard/user/UserReviews';
import UserProfile from '../pages/dashboard/user/UserProfile';
import AdminDMain from '../pages/dashboard/admin/dashboard/AdminDMain';
import UserDMain from '../pages/dashboard/user/dashboard/UserDMain';
import AddProduct from '../pages/dashboard/admin/addProduct/AddProduct';
import ManageProducts from '../pages/dashboard/admin/manageProduct/ManageProducts';
import UpdateProduct from '../pages/dashboard/admin/manageProduct/UpdateProduct';
import ManageUser from '../pages/dashboard/admin/users/ManageUser';
import ManageOrders from '../pages/dashboard/admin/manageOrders/ManageOrders';
import Contact from "../pages/contact/Contact";
import CheckoutPage from '../pages/shop/CheckoutPage';
import PaymentChat from '../pages/shop/PaymentChat';
import AdminChats from '../pages/dashboard/admin/chat/AdminChats';
import AdminChatDetail from '../pages/dashboard/admin/chat/AdminChatDetail';
import CustomerPaymentChat from '../pages/dashboard/user/CustomerPaymentChat';

// 🚀 Bundle Deals Components
import AddBundle from '../pages/dashboard/admin/addProduct/AddBundle'; 
import ManageBundles from '../pages/dashboard/admin/manageProduct/ManageBundles';
import UpdateBundle from '../pages/dashboard/admin/manageProduct/UpdateBundle'; 

// 🚀 Naya Import: Send Promo Email Page (Admin)
import SendPromoEmail from '../pages/dashboard/admin/SendPromoEmail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/categories/:categoryName', element: <CategoryPage /> },
      { path: '/shop', element: <ShopPage /> },
      { path: '/search', element: <Search /> },
      { path: '/shop/:id', element: <SingleProduct /> },
      // ✅ Naya Route: Jab Bundle par click ho
      { path: '/bundles/:id', element: <SingleBundle /> }, 
      { path: "/contact", element: <Contact /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/payment-chat", element: <PaymentChat /> },
      { path: "/success", element: <PaymentSuccess /> },
      { path: "/orders/:orderId", element: <OrderDetails /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> }, // ✅ Naya Route: Forgot password ka path register kar diya
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      // 1. User/Customer Routes
      { path: '', element: <UserDMain /> },
      { path: 'orders', element: <UserOrders /> },
      { path: 'payments', element: <UserPayments /> },
      { path: 'profile', element: <UserProfile /> },
      { path: 'reviews', element: <UserReviews /> },
      { path: 'payment-support', element: <CustomerPaymentChat /> },
      { path: 'payment-support/:id', element: <CustomerPaymentChat /> },

      // 2. Admin Routes (Strictly Admin only)
      {
        path: 'admin',
        element: <PrivateRoute role="admin"><AdminDMain /></PrivateRoute>,
      },
      {
        path: 'add-new-post',
        element: <PrivateRoute role="admin"><AddProduct /></PrivateRoute>,
      },
      // ✅ Add Hot Deal Route
      {
        path: 'add-bundle',
        element: <PrivateRoute role="admin"><AddBundle /></PrivateRoute>,
      },
      // ✅ Manage Hot Deals Route
      {
        path: 'manage-bundles',
        element: <PrivateRoute role="admin"><ManageBundles /></PrivateRoute>,
      },
      // ✅ Edit Hot Deal Route
      {
        path: 'edit-bundle/:id',
        element: <PrivateRoute role="admin"><UpdateBundle /></PrivateRoute>,
      },
      {
        path: 'manage-products',
        element: <PrivateRoute role="admin"><ManageProducts /></PrivateRoute>,
      },
      {
        path: 'update-product/:id',
        element: <PrivateRoute role="admin"><UpdateProduct /></PrivateRoute>,
      },
      {
        path: 'users',
        element: <PrivateRoute role="admin"><ManageUser /></PrivateRoute>,
      },
      {
        path: 'manage-orders',
        element: <PrivateRoute role="admin"><ManageOrders /></PrivateRoute>,
      },
      {
        path: 'chats',
        element: <PrivateRoute role="admin"><AdminChats /></PrivateRoute>,
      },
      {
        path: 'chats/:id',
        element: <PrivateRoute role="admin"><AdminChatDetail /></PrivateRoute>,
      },
      // 🚀 Naya Route: Promotional Email Blast
      {
        path: 'send-promo',
        element: <PrivateRoute role="admin"><SendPromoEmail /></PrivateRoute>,
      }
    ],
  },
]);

export default router;