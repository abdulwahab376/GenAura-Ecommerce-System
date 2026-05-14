// // 

// import React from 'react'

// const AdminStats = ({ stats }) => {
//     // Safety Check: Agar stats load nahi huay to crash na ho
//     if (!stats) return <div className="text-center p-5 text-primary">Loading statistics...</div>;

//     return (
//         <div className="my-5 space-y-6">
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                
//                 {/* Total Earning */}
//                 <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
//                     <div className="bg-green-100 p-3 rounded-full">
//                         <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
//                     </div>
//                     <div>
//                         <p className="text-sm font-medium text-gray-500">Total Earning</p>
//                         <h2 className="text-2xl font-bold text-gray-800">${Math.round(stats.totalEarnings || 0)}</h2>
//                     </div>
//                 </div>

//                 {/* All Orders */}
//                 <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
//                     <div className="bg-blue-100 p-3 rounded-full">
//                         <i className="ri-shopping-bag-3-line text-2xl text-blue-600"></i>
//                     </div>
//                     <div>
//                         <p className="text-sm font-medium text-gray-500">All Orders</p>
//                         <h2 className="text-2xl font-bold text-gray-800">{stats.totalOrders || 0}</h2>
//                     </div>
//                 </div>

//                 {/* All Users */}
//                 <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
//                     <div className="bg-purple-100 p-3 rounded-full">
//                         <i className="ri-user-line text-2xl text-purple-600"></i>
//                     </div>
//                     <div>
//                         <p className="text-sm font-medium text-gray-500">All Users</p>
//                         <h2 className="text-2xl font-bold text-gray-800">{stats.totalUsers || 0}</h2>
//                     </div>
//                 </div>

//                 {/* Total Products */}
//                 <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
//                     <div className="bg-orange-100 p-3 rounded-full">
//                         <i className="ri-stack-line text-2xl text-orange-600"></i>
//                     </div>
//                     <div>
//                         <p className="text-sm font-medium text-gray-500">Total Products</p>
//                         <h2 className="text-2xl font-bold text-gray-800">{stats.totalProducts || 0}</h2>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     )
// }

// export default AdminStats



import React from 'react'

const AdminStats = ({ stats }) => {
    if (!stats) return (
        <div className="flex items-center justify-center p-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-500 font-medium">Loading statistics...</span>
        </div>
    );

    return (
        <div className="my-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                
                {/* 1. Total Earning */}
                <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="bg-emerald-500 p-2.5 rounded-lg shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
                            <i className="ri-money-dollar-circle-fill text-xl text-white"></i>
                        </div>
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">+12%</span>
                    </div>
                    <div>
                        <p className="text-[13px] uppercase tracking-widest font-bold text-emerald-900/40">Revenue</p>
                        <h2 className="text-xl font-black text-emerald-950">
                            {/* ✅ Updated to Rs. and formatted with toLocaleString */}
                            Rs. {Math.round(stats.totalEarnings || 0).toLocaleString()}
                        </h2>
                    </div>
                </div>

                {/* 2. All Orders */}
                <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="bg-blue-600 p-2.5 rounded-lg shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                            <i className="ri-shopping-bag-3-fill text-xl text-white"></i>
                        </div>
                        <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">New</span>
                    </div>
                    <div>
                        <p className="text-[13px] uppercase tracking-widest font-bold text-blue-900/40">Orders</p>
                        <h2 className="text-xl font-black text-blue-950">
                            {stats.totalOrders || 0}
                        </h2>
                    </div>
                </div>

                {/* 3. All Users */}
                <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="bg-purple-600 p-2.5 rounded-lg shadow-lg shadow-purple-200 group-hover:scale-105 transition-transform">
                            <i className="ri-user-star-fill text-xl text-white"></i>
                        </div>
                        <span className="text-[9px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Active</span>
                    </div>
                    <div>
                        <p className="text-[13px] uppercase tracking-widest font-bold text-purple-900/40">Customers</p>
                        <h2 className="text-xl font-black text-purple-950">
                            {stats.totalUsers || 0}
                        </h2>
                    </div>
                </div>

                {/* 4. Total Products */}
                <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="bg-amber-500 p-2.5 rounded-lg shadow-lg shadow-amber-200 group-hover:scale-105 transition-transform">
                            <i className="ri-box-3-fill text-xl text-white"></i>
                        </div>
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Stock</span>
                    </div>
                    <div>
                        <p className="text-[13px] uppercase tracking-widest font-bold text-amber-900/40">Products</p>
                        <h2 className="text-xl font-black text-amber-950">
                            {stats.totalProducts || 0}
                        </h2>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AdminStats;