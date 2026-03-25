import React from 'react'

const DashboardProductsSummary = ({ outOfStockProducts = [], topSellingProducts = [] }) => {
    
    // Table Row Component - Saaf aur Compact Design ke liye
    const TableRow = ({ name, category, value, isStockAlert }) => (
        <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
            <td className="py-3 px-3 flex flex-col gap-0.5">
                {/* Product Name - Bold aur Clean */}
                <p className="text-xs font-extrabold text-slate-800 line-clamp-1 tracking-tight">{name}</p>
                {/* Category - Halka aur Uppercase */}
                <span className="text-[10px] text-slate-400 uppercase tracking-tighter font-medium">{category}</span>
            </td>
            <td className="py-3 px-3 text-right">
                {/* Value - Laal agar stock alert hai, emerald agar sales hain */}
                <span className={`text-xs font-black ${isStockAlert ? 'text-red-500' : 'text-emerald-600'}`}>
                    {value} {isStockAlert ? 'Left' : 'Sold'}
                </span>
            </td>
        </tr>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-10">
            
            {/* ==========================================
               1. HIGHEST SALE PRODUCTS (Best Sellers)
            =========================================== */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Header with Fire Icon and Badge */}
                <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2.5">
                        <i className="ri-fire-fill text-orange-500 text-lg"></i>
                        Highest Sale Products
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-bold">Top 5</span>
                </div>
                {/* Table Area */}
                <div className="p-3">
                    <table className="w-full text-left table-auto">
                        <thead>
                            <tr className="text-[10px] uppercase text-slate-400 tracking-widest">
                                <th className="px-3 py-2.5 font-bold">Product Details</th>
                                <th className="px-3 py-2.5 text-right font-bold">Units Sold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topSellingProducts.length > 0 ? topSellingProducts.map((item, idx) => (
                                <TableRow 
                                    key={idx} 
                                    name={item.name} 
                                    category={item.category} 
                                    value={item.totalSales} 
                                    isStockAlert={false} 
                                />
                            )) : (
                                <tr className="text-center text-xs text-slate-400">
                                    <td colSpan="2" className="py-6 flex flex-col items-center gap-2">
                                        <i className="ri-shopping-cart-2-line text-2xl text-slate-300"></i>
                                        No sales recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ==========================================
               2. OUT OF STOCK PRODUCTS (Stock Alerts)
            =========================================== */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Header with Warning Icon and Badge */}
                <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2.5">
                        <i className="ri-error-warning-fill text-red-500 text-lg"></i>
                        Out of Stock / Low Stock
                    </h3>
                    <span className="text-[10px] bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-bold">Urgent</span>
                </div>
                {/* Table Area */}
                <div className="p-3">
                    <table className="w-full text-left table-auto">
                        <thead>
                            <tr className="text-[10px] uppercase text-slate-400 tracking-widest">
                                <th className="px-3 py-2.5 font-bold">Product Details</th>
                                <th className="px-3 py-2.5 text-right font-bold">Inventory</th>
                            </tr>
                        </thead>
                        <tbody>
                            {outOfStockProducts.length > 0 ? outOfStockProducts.map((item, idx) => (
                                <TableRow 
                                    key={idx} 
                                    name={item.name} 
                                    category={item.category} 
                                    value={item.stock} 
                                    isStockAlert={true} 
                                />
                            )) : (
                                <tr className="text-center text-xs text-slate-400">
                                    <td colSpan="2" className="py-6 flex flex-col items-center gap-2">
                                        <i className="ri-checkbox-circle-line text-2xl text-emerald-300"></i>
                                        Inventory is healthy.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default DashboardProductsSummary;