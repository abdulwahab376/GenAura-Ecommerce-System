// import React from 'react';
// import AdminStats from './AdminStats';
// import { useSelector } from 'react-redux';
// import { useGetAdminStatsQuery } from '../../../../redux/features/stats/statsApi';
// import AdminStatsChart from './AdminStatsChart';
// import DashboardProductsSummary from './DashboardProductsSummary';

// const AdminDMain = () => {
//     const { user } = useSelector((state) => state.auth);
//     const { data: stats, error, isLoading } = useGetAdminStatsQuery();
    
//     console.log("Admin Stats Data:", stats);

//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
//                 <div className="flex flex-col items-center gap-4">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-opacity-50"></div>
//                     <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">Syncing Lebaba Data...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="p-10 text-center">
//                 <i className="ri-error-warning-line text-5xl text-red-500"></i>
//                 <p className="text-red-500 mt-4 font-black uppercase tracking-tight">System Error: Failed to fetch stats</p>
//             </div>
//         );
//     }

//     return (
//         <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
//             {/* --- 1. Header Section --- */}
//             <div className="mb-10">
//                 <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
//                     Admin <span className="text-indigo-600">Dashboard</span>
//                 </h1>
//                 <p className="text-slate-500 font-medium mt-1">
//                     Welcome back, <span className="text-slate-800 font-bold italic">{user?.username}</span>. Here is your store summary.
//                 </p>
//             </div>

//             {/* --- 2. Top Stats Cards (Revenue, Users, etc.) --- */}
//             <AdminStats stats={stats} />

//             {/* --- 3. Middle Section: Products Summary (Ab Ye Pehle Ayega) --- */}
//             {/* Best Sellers and Out of Stock Alerts Table */}
//             <DashboardProductsSummary 
//                 topSellingProducts={stats?.topSellingProducts || []} 
//                 outOfStockProducts={stats?.outOfStockProducts || []} 
//             />

//             {/* --- 4. Bottom Section: Analytics & Charts --- */}
//             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mt-10">
//                 <div className="flex items-center justify-between mb-8">
//                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
//                         <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
//                             <i className="ri-line-chart-fill text-lg"></i>
//                         </div>
//                         Sales Performance Analytics
//                     </h3>
//                     <span className="text-[10px] font-bold text-slate-400 border border-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">
//                         Live Data
//                     </span>
//                 </div>
                
//                 {/* Chart Box */}
//                 <div className="w-full">
//                     <AdminStatsChart stats={stats} />
//                 </div>
//             </div>

//             {/* Subtle Footer for Brand feel */}
//             <footer className="mt-12 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest border-t border-slate-100 pt-6">
//             </footer>
// import { useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi';
// import { Wallet, ShoppingBag, Clock, Truck } from 'lucide-react';

// const AdminDMain = () => {
//     // Fetch real data from your database
//     const { data: orders, isLoading } = useGetAllOrdersQuery();

//     // Safely extract the array
//     const ordersList = Array.isArray(orders) ? orders : (orders?.orders || []);

//     // Calculate Stats
//     const totalOrders = ordersList.length;
//     const pendingOrders = ordersList.filter(o => o.status === 'pending').length;
//     const shippedOrders = ordersList.filter(o => o.status === 'shipped').length;

//     // Calculate Revenue (Only counting approved/completed/shipped orders)
//     const totalRevenue = ordersList
//         .filter(o => ['approved', 'processing', 'shipped', 'completed'].includes(o.status))
//         .reduce((sum, order) => sum + (order.amount || order.totalAmount || 0), 0);

//     if (isLoading) return <div className="p-8 text-gray-500 font-bold animate-pulse">Loading Dashboard Stats...</div>;

//     return (
//         <div className="p-4 md:p-8 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[60vh]">
//             <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-900 mb-2 md:mb-8 pr-12 md:pr-0">
//                 Admin Overview
//             </h1>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
//                 {/* Revenue Card */}
//                 <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex items-center gap-4">
//                     <div className="bg-indigo-500 p-3 rounded-lg text-white">
//                         <Wallet size={24} />
//                     </div>
//                     <div>
//                         <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Total Revenue</p>
//                         <h3 className="text-2xl font-black text-slate-900">${totalRevenue.toFixed(2)}</h3>
//                     </div>
//                 </div>

//                 {/* Total Orders Card */}
//                 <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center gap-4">
//                     <div className="bg-blue-500 p-3 rounded-lg text-white">
//                         <ShoppingBag size={24} />
//                     </div>
//                     <div>
//                         <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Total Orders</p>
//                         <h3 className="text-2xl font-black text-slate-900">{totalOrders}</h3>
//                     </div>
//                 </div>

//                 {/* Pending Approvals Card */}
//                 <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 flex items-center gap-4">
//                     <div className="bg-orange-500 p-3 rounded-lg text-white">
//                         <Clock size={24} />
//                     </div>
//                     <div>
//                         <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">Pending Action</p>
//                         <h3 className="text-2xl font-black text-slate-900">{pendingOrders}</h3>
//                     </div>
//                 </div>

//                 {/* Shipped Card */}
//                 <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex items-center gap-4">
//                     <div className="bg-green-500 p-3 rounded-lg text-white">
//                         <Truck size={24} />
//                     </div>
//                     <div>
//                         <p className="text-xs font-bold text-green-500 uppercase tracking-wider">Shipped</p>
//                         <h3 className="text-2xl font-black text-slate-900">{shippedOrders}</h3>
//                     </div>
//                 </div>
//             </div>

//             {/* Quick Recent Orders Table (Optional layout filler) */}
//             <div className="border border-gray-200 rounded-xl overflow-hidden">
//                 <div className="bg-slate-50 border-b border-gray-200 p-4">
//                     <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Recent Activity</h3>
//                 </div>
//                 <div className="p-4">
//                     {ordersList.slice(0, 5).map(order => (
//                         <div key={order._id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
//                             <span className="text-sm font-medium text-slate-700">#{order._id?.slice(-6) || 'N/A'}</span>
//                             <span className="text-sm text-slate-500">{order.email}</span>
//                             <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
//                                 }`}>
//                                 {order.status}
//                             </span>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminDMain;




import React from 'react';
import { useSelector } from 'react-redux';

// Your imports
import AdminStats from './AdminStats';
import { useGetAdminStatsQuery } from '../../../../redux/features/stats/statsApi';
import AdminStatsChart from './AdminStatsChart';
import DashboardProductsSummary from './DashboardProductsSummary';

// Friend imports
import { useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi';
import { Wallet, ShoppingBag, Clock, Truck } from 'lucide-react';

const AdminDMain = () => {
    const { user } = useSelector((state) => state.auth);

    // Your stats API
    const { data: stats, error, isLoading } = useGetAdminStatsQuery();

    // Friend orders API
    const { data: orders, isLoading: ordersLoading } = useGetAllOrdersQuery();

    const ordersList = Array.isArray(orders) ? orders : (orders?.orders || []);

    const totalOrders = ordersList.length;
    const pendingOrders = ordersList.filter(o => o.status === 'pending').length;
    const shippedOrders = ordersList.filter(o => o.status === 'shipped').length;

    const totalRevenue = ordersList
        .filter(o => ['approved', 'processing', 'shipped', 'completed'].includes(o.status))
        .reduce((sum, order) => sum + (order.amount || order.totalAmount || 0), 0);

    // Loader
    if (isLoading || ordersLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
                <p className="font-bold">Loading Dashboard...</p>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="p-10 text-center">
                <p className="text-red-500 font-bold">Failed to load stats</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-black">
                    Admin Dashboard
                </h1>
                <p>
                    Welcome, {user?.username}
                </p>
            </div>

            {/* ===== YOUR STATS SECTION ===== */}
            <AdminStats stats={stats} />

            <DashboardProductsSummary 
                topSellingProducts={stats?.topSellingProducts || []} 
                outOfStockProducts={stats?.outOfStockProducts || []} 
            />

            <div className="bg-white p-6 rounded-xl mt-10">
                <AdminStatsChart stats={stats} />
            </div>

            {/* ===== FRIEND ORDERS SECTION ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">

                <div className="p-4 bg-orange-100 rounded">
                    <p>Pending</p>
                    <h2>{pendingOrders}</h2>
                </div>

                <div className="p-4 bg-green-100 rounded">
                    <p>Shipped</p>
                    <h2>{shippedOrders}</h2>
                </div>
            </div>

        </div>
    );
};

export default AdminDMain;