import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminDashboard from './AdminDashboard'; 
// ✅ 1. Import your User Sidebar here! (Make sure the path and name are correct for your app)
import UserDashboard from './UserDashboard'; 

const DashboardLayout = () => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const isAdmin = user?.role === 'admin';

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            
            {/* ✅ 2. Show Admin sidebar for Admins, and User sidebar for regular users! */}
            {isAdmin ? <AdminDashboard /> : <UserDashboard />}

            {/* ✅ 3. We keep the margin (md:ml-72) so the content doesn't hide behind EITHER sidebar */}
            <div className="flex-1 w-full md:ml-72 p-4 md:p-8 transition-all duration-300 overflow-x-hidden">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;