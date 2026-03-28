// import React from 'react';
// import { useSelector } from 'react-redux';
// import { useGetOrdersByEmailQuery } from '../../../redux/features/orders/orderApi';
// import { Link } from 'react-router-dom';

// const UserOrders = () => {
//     const { user } = useSelector((state) => state.auth);
//     const { data: orders, error, isLoading } = useGetOrdersByEmailQuery(user?.email);

//     if (isLoading) return <div>Loading...</div>;
//     if (error) return <div>No order found!</div>;

//     return (
//         <section className="py-1 bg-blueGray-50">
//             <div className="w-full mb-12 xl:mb-0 px-4 mx-auto">
//                 <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
//                     <div className="rounded-t mb-0 px-4 py-3 border-0">
//                         <div className="flex flex-wrap items-center">
//                             <div className="relative w-full px-4 max-w-full flex-grow flex-1">
//                                 <h3 className="font-semibold text-base text-blueGray-700">Your Orders</h3>
//                             </div>
//                             <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
//                                 <button className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
//                                     See all
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="block w-full overflow-x-auto">
//                         <table className="items-center bg-transparent w-full border-collapse">
//                             <thead>
//                                 <tr>
//                                     <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
//                                         #
//                                     </th>
//                                     <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
//                                         Order ID
//                                     </th>
//                                     <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
//                                         Date
//                                     </th>
//                                     <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
//                                         Status
//                                     </th>
//                                     <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
//                                         Total
//                                     </th>
//                                     <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
//                                         View Order
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {orders && orders.map((order, index) => (
//                                     <tr key={order._id} className="hover:bg-blueGray-100">
//                                         <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700">
//                                             {index + 1}
//                                         </th>
//                                         <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700">
//                                           {order._id}
//                                         </th>
//                                         <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
//                                             {new Date(order.createdAt).toLocaleDateString()}
//                                         </td>
//                                         <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
//                                             <span className={`p-1 rounded ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
//                                                 order.status === 'pending' ? 'bg-red-200 text-red-700' :
//                                                     order.status === 'processing' ? 'bg-blue-200 text-blue-700' :
//                                                         'bg-indigo-100 text-indigo-600'}`}>
//                                                 {order.status}
//                                             </span>
//                                         </td>
//                                         <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
//                                             ${order.amount.toFixed(2)}
//                                         </td>
//                                         <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap hover:text-primary p-4 text-center">
//                                             <Link to={`/orders/${order._id}`}>View Order</Link>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//             <footer className="relative pt-8 pb-6 mt-16">
//                 <div className="container mx-auto px-4">
//                     <div className="flex flex-wrap items-center md:justify-between justify-center">
//                         <div className="w-full md:w-6/12 px-4 mx-auto text-center">
//                             <div className="text-sm text-blueGray-500 font-semibold py-1">
//                             <a href="https://www.creative-tim.com/product/notus-js" className="text-blueGray-500 hover:text-gray-800" target="_blank" rel="noopener noreferrer"></a><a href="https://www.creative-tim.com" className="text-blueGray-500 hover:text-blueGray-800" target="_blank" rel="noopener noreferrer"></a>.
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </footer>
//         </section>
//     );
// }

// export default UserOrders;




import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetOrdersByEmailQuery } from '../../../redux/features/orders/orderApi';
import { Link } from 'react-router-dom';

const UserOrders = () => {
    const { user } = useSelector((state) => state.auth);
    const { data: orders, error, isLoading } = useGetOrdersByEmailQuery(user?.email);
    
    // State to handle which row is expanded
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const toggleRow = (id) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    if (isLoading) return <div className="p-10 text-center text-indigo-600 font-semibold">Loading orders...</div>;
    if (error) return <div className="p-10 text-center text-red-500">No orders found!</div>;

    return (
        <section className="py-6 bg-gray-50">
            <div className="w-full px-4 mx-auto">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-sm rounded-2xl border border-gray-100">
                    <div className="rounded-t-2xl mb-0 px-6 py-4 border-b border-gray-50 bg-white">
                        <h3 className="font-bold text-xl text-slate-800">Your Orders</h3>
                    </div>

                    <div className="block w-full overflow-x-auto">
                        <table className="items-center bg-transparent w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                    <th className="px-6 py-4 text-left border-b border-gray-100">#</th>
                                    <th className="px-6 py-4 text-left border-b border-gray-100">Order ID</th>
                                    <th className="px-6 py-4 text-left border-b border-gray-100">Date</th>
                                    <th className="px-6 py-4 text-left border-b border-gray-100">Status</th>
                                    <th className="px-6 py-4 text-left border-b border-gray-100">Total</th>
                                    <th className="px-6 py-4 text-center border-b border-gray-100">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders && orders.map((order, index) => (
                                    <React.Fragment key={order._id}>
                                        {/* Main Order Row */}
                                        <tr className={`hover:bg-slate-50/50 transition-colors ${expandedOrderId === order._id ? 'bg-indigo-50/30' : ''}`}>
                                            <td className="px-6 py-4 text-sm">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm font-mono text-slate-500">#{order._id.slice(-6)}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {new Date(order.createdAt).toLocaleDateString('en-GB')}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold">
                                                <span className={`px-3 py-1 rounded-full uppercase tracking-wider ${
                                                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-700">
                                                Rs. {Number(order.amount).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-center flex items-center justify-center gap-3">
                                                {/* ✅ View Button: Toggles the sub-row */}
                                                <button 
                                                    onClick={() => toggleRow(order._id)}
                                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                                                        expandedOrderId === order._id 
                                                        ? 'bg-indigo-600 text-white' 
                                                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                                    }`}
                                                >
                                                    <i className={expandedOrderId === order._id ? "ri-close-line" : "ri-eye-line"}></i>
                                                    {expandedOrderId === order._id ? 'Close' : 'View Items'}
                                                </button>

                                                <Link 
                                                    to={`/orders/${order._id}`} 
                                                    className="bg-green-50 text-green-600 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1"
                                                >
                                                    <i className="ri-truck-line"></i> Track
                                                </Link>
                                            </td>
                                        </tr>

                                        {/* ✅ Expanded Row: Show Products right under the clicked order */}
                                        {expandedOrderId === order._id && (
                                            <tr className="bg-indigo-50/20">
                                                <td colSpan="6" className="px-6 py-4">
                                                    <div className="flex flex-col gap-3 animate-in fade-in duration-300">
                                                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest px-2">Order Content:</p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                            {order.products.map((product, pIdx) => (
                                                                <div key={pIdx} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-indigo-100 shadow-sm">
                                                                    <img 
                                                                        src={product.image} 
                                                                        alt={product.name} 
                                                                        className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                                                                    />
                                                                    <div className="overflow-hidden">
                                                                        <p className="text-sm font-semibold text-slate-800 truncate">{product.name}</p>
                                                                        <p className="text-xs text-slate-500 italic">Quantity: {product.quantity || 1}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default UserOrders;