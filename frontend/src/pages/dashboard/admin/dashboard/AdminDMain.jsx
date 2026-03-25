import React from 'react';
import AdminStats from './AdminStats';
import { useSelector } from 'react-redux';
import { useGetAdminStatsQuery } from '../../../../redux/features/stats/statsApi';
import AdminStatsChart from './AdminStatsChart';
import DashboardProductsSummary from './DashboardProductsSummary';

const AdminDMain = () => {
    const { user } = useSelector((state) => state.auth);
    const { data: stats, error, isLoading } = useGetAdminStatsQuery();
    
    console.log("Admin Stats Data:", stats);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-opacity-50"></div>
                    <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">Syncing Lebaba Data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center">
                <i className="ri-error-warning-line text-5xl text-red-500"></i>
                <p className="text-red-500 mt-4 font-black uppercase tracking-tight">System Error: Failed to fetch stats</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
            {/* --- 1. Header Section --- */}
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                    Admin <span className="text-indigo-600">Dashboard</span>
                </h1>
                <p className="text-slate-500 font-medium mt-1">
                    Welcome back, <span className="text-slate-800 font-bold italic">{user?.username}</span>. Here is your store summary.
                </p>
            </div>

            {/* --- 2. Top Stats Cards (Revenue, Users, etc.) --- */}
            <AdminStats stats={stats} />

            {/* --- 3. Middle Section: Products Summary (Ab Ye Pehle Ayega) --- */}
            {/* Best Sellers and Out of Stock Alerts Table */}
            <DashboardProductsSummary 
                topSellingProducts={stats?.topSellingProducts || []} 
                outOfStockProducts={stats?.outOfStockProducts || []} 
            />

            {/* --- 4. Bottom Section: Analytics & Charts --- */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mt-10">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                            <i className="ri-line-chart-fill text-lg"></i>
                        </div>
                        Sales Performance Analytics
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 border border-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">
                        Live Data
                    </span>
                </div>
                
                {/* Chart Box */}
                <div className="w-full">
                    <AdminStatsChart stats={stats} />
                </div>
            </div>

            {/* Subtle Footer for Brand feel */}
            <footer className="mt-12 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest border-t border-slate-100 pt-6">
            </footer>
        </div>
    );
};

export default AdminDMain;