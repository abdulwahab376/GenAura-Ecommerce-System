import React from 'react';
import { useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi';
import { Wallet, ShoppingBag, Clock, Truck } from 'lucide-react';

const AdminDMain = () => {
    // Fetch real data from your database
    const { data: orders, isLoading } = useGetAllOrdersQuery();

    // Safely extract the array
    const ordersList = Array.isArray(orders) ? orders : (orders?.orders || []);

    // Calculate Stats
    const totalOrders = ordersList.length;
    const pendingOrders = ordersList.filter(o => o.status === 'pending').length;
    const shippedOrders = ordersList.filter(o => o.status === 'shipped').length;

    // Calculate Revenue (Only counting approved/completed/shipped orders)
    const totalRevenue = ordersList
        .filter(o => ['approved', 'processing', 'shipped', 'completed'].includes(o.status))
        .reduce((sum, order) => sum + (order.amount || order.totalAmount || 0), 0);

    if (isLoading) return <div className="p-8 text-gray-500 font-bold animate-pulse">Loading Dashboard Stats...</div>;

    return (
        <div className="p-4 md:p-8 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[60vh]">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-900 mb-2 md:mb-8 pr-12 md:pr-0">
                Admin Overview
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
                {/* Revenue Card */}
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex items-center gap-4">
                    <div className="bg-indigo-500 p-3 rounded-lg text-white">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Total Revenue</p>
                        <h3 className="text-2xl font-black text-slate-900">${totalRevenue.toFixed(2)}</h3>
                    </div>
                </div>

                {/* Total Orders Card */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center gap-4">
                    <div className="bg-blue-500 p-3 rounded-lg text-white">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Total Orders</p>
                        <h3 className="text-2xl font-black text-slate-900">{totalOrders}</h3>
                    </div>
                </div>

                {/* Pending Approvals Card */}
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 flex items-center gap-4">
                    <div className="bg-orange-500 p-3 rounded-lg text-white">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">Pending Action</p>
                        <h3 className="text-2xl font-black text-slate-900">{pendingOrders}</h3>
                    </div>
                </div>

                {/* Shipped Card */}
                <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex items-center gap-4">
                    <div className="bg-green-500 p-3 rounded-lg text-white">
                        <Truck size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-green-500 uppercase tracking-wider">Shipped</p>
                        <h3 className="text-2xl font-black text-slate-900">{shippedOrders}</h3>
                    </div>
                </div>
            </div>

            {/* Quick Recent Orders Table (Optional layout filler) */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 border-b border-gray-200 p-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Recent Activity</h3>
                </div>
                <div className="p-4">
                    {ordersList.slice(0, 5).map(order => (
                        <div key={order._id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                            <span className="text-sm font-medium text-slate-700">#{order._id?.slice(-6) || 'N/A'}</span>
                            <span className="text-sm text-slate-500">{order.email}</span>
                            <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDMain;