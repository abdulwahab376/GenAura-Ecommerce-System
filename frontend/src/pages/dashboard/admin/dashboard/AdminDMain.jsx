import React from 'react';

const AdminDMain = () => {
    return (
        // ✅ Reduced padding on mobile (p-4), large padding on desktop (md:p-8)
        <div className="p-4 md:p-8 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[60vh]">
            
            {/* ✅ Smaller text on mobile, larger on desktop */}
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-900 mb-2 md:mb-4 pr-12 md:pr-0">
                Admin Overview
            </h1>
            
            <p className="text-sm md:text-base text-gray-500 font-medium">
                Welcome to the control panel. Select an option from the sidebar to manage products, inventory, and user orders.
            </p>
        </div>
    );
};

export default AdminDMain;