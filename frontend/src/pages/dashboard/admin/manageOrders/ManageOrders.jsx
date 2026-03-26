// import React, { useState } from 'react';
// import UpdateOrderModal from './UpdateOrderModal';
// import { useDeleteOrderMutation, useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi';
// import { formatDate } from '../../../../utils/dateFormater';
// import { toast } from 'react-hot-toast';

// const ManageOrders = () => {
//     const { data: orders, error, isLoading, refetch } = useGetAllOrdersQuery();
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [deleteOrder] = useDeleteOrderMutation();

//     const handleActionClick = (order) => {
//         setSelectedOrder(order);
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setSelectedOrder(null);
//     };

//     //  FIXED: Using sessionStorage to match the rest of the app
//     const getRealStatus = (order) => {
//         const chatStatus = sessionStorage.getItem(`chat_${order._id}_status`);
//         return chatStatus || order.status;
//     };

//     const handleDeleteClick = async (orderId) => {
//         if (window.confirm("Are you sure you want to delete this order?")) {
//             try {
//                 await deleteOrder(orderId).unwrap();
//                 toast.success("Order deleted successfully");
//                 refetch();
//             } catch (err) {
//                 toast.error("Failed to delete order");
//             }
//         }
//     };

//     if (isLoading) return <div className="p-10 text-center font-bold text-indigo-600">Loading Orders...</div>;
//     if (error) return <div className="p-10 text-red-500 text-center">Error: {error.message}</div>;

//     return (
//         <div className="section__container p-6 bg-gray-50 min-h-screen">
//             <h2 className="text-2xl font-bold mb-6 text-gray-800 uppercase tracking-tight">Manage Orders</h2>

//             <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
//                 <table className="min-w-full text-sm text-left">
//                     <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-bold">
//                         <tr>
//                             <th className="py-4 px-4 border-b text-center">#</th>
//                             <th className="py-4 px-6 border-b">Order ID</th>
//                             <th className="py-4 px-6 border-b">Customer</th>
//                             <th className="py-4 px-6 border-b text-center">Status</th>
//                             <th className="py-4 px-6 border-b">Total Amount</th>
//                             <th className="py-4 px-6 border-b">Date</th>
//                             <th className="py-4 px-6 border-b text-center">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                         {orders && orders.map((order, index) => {
//                             //  FIXED: We actually call the function here to get the real status
//                             const currentStatus = getRealStatus(order); 

//                             return (
//                             <tr key={index} className="hover:bg-gray-50 transition-colors">
//                                 <td className="py-4 px-4 text-center font-bold text-gray-400">
//                                     {index + 1}
//                                 </td>

//                                 <td className="py-4 px-6 font-mono text-indigo-600 font-medium text-xs">
//                                     #{order._id.slice(-6)}
//                                 </td>
//                                 <td className="py-4 px-6 font-medium text-gray-800">{order?.email}</td>
                                
//                                 <td className="py-4 px-6 text-center">
//                                     {/*  FIXED: Applied currentStatus instead of order.status */}
//                                     <span className={`px-3 py-1 text-[10px] font-bold text-white rounded-full shadow-sm ${getStatusColor(currentStatus.toLowerCase())}`}>
//                                         {currentStatus.toUpperCase()}
//                                     </span>
//                                 </td>

//                                 <td className="py-4 px-6 font-bold text-black-600">
//                                     ${order?.totalAmount || order?.amount || order?.price || "0.00"}
//                                 </td>

//                                 <td className="py-4 px-6 text-gray-500 text-xs">{formatDate(order?.updatedAt)}</td>

//                                 <td className="py-4 px-6 flex justify-center items-center space-x-4">
//                                     <button
//                                         onClick={() => handleActionClick(order)}
//                                         className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg font-bold text-[11px] border border-blue-100 transition-all"
//                                     >
//                                         VIEW / EDIT
//                                     </button>

//                                     <button
//                                         onClick={() => handleDeleteClick(order?._id)}
//                                         className="text-red-500 hover:text-red-700 transition-all p-1"
//                                         title="Delete Order"
//                                     >
//                                         <i className="ri-delete-bin-line text-lg"></i>
//                                     </button>
//                                 </td>
//                             </tr>
//                         )})}
//                     </tbody>
//                 </table>
//             </div>

//             {selectedOrder && (
//                 <UpdateOrderModal
//                     order={selectedOrder}
//                     isOpen={isModalOpen}
//                     onClose={handleCloseModal}
//                 />
//             )}
//         </div>
//     );
// };

// const getStatusColor = (status) => {
//     switch (status) {
//         case 'approved': return 'bg-green-600';
//         case 'rejected': return 'bg-red-500';
//         case 'pending': return 'bg-orange-500';
//         case 'processing': return 'bg-blue-500';
//         case 'shipped': return 'bg-indigo-500';
//         case 'completed': return 'bg-green-600';
//         default: return 'bg-gray-400';
//     }
// };

// export default ManageOrders;


import React, { useState } from 'react';
import UpdateOrderModal from './UpdateOrderModal';
import { useDeleteOrderMutation, useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi';
import { formatDate } from '../../../../utils/dateFormater';
import { toast } from 'react-hot-toast';

const ManageOrders = () => {
    const { data: orders, error, isLoading, refetch } = useGetAllOrdersQuery();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteOrder] = useDeleteOrderMutation();

    const handleActionClick = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    //  FIXED: Using sessionStorage to match the rest of the app
    const getRealStatus = (order) => {
        const chatStatus = sessionStorage.getItem(`chat_${order._id}_status`);
        return chatStatus || order.status;
    };

    const handleDeleteClick = async (orderId) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await deleteOrder(orderId).unwrap();
                toast.success("Order deleted successfully");
                refetch();
            } catch (err) {
                toast.error("Failed to delete order");
            }
        }
    };

    if (isLoading) return <div className="p-10 text-center font-bold text-indigo-600">Loading Orders...</div>;
    if (error) return <div className="p-10 text-red-500 text-center">Error: {error.message}</div>;

    return (
        <div className="section__container p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 uppercase tracking-tight">Manage Orders</h2>

            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-bold">
                        <tr>
                            <th className="py-4 px-4 border-b text-center">#</th>
                            <th className="py-4 px-6 border-b">Order ID</th>
                            <th className="py-4 px-6 border-b">Customer</th>
                            <th className="py-4 px-6 border-b text-center">Status</th>
                            <th className="py-4 px-6 border-b">Total Amount</th>
                            <th className="py-4 px-6 border-b">Date</th>
                            <th className="py-4 px-6 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders && orders.map((order, index) => {
                            //  FIXED: We actually call the function here to get the real status
                            const currentStatus = getRealStatus(order); 

                            return (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4 text-center font-bold text-gray-400">
                                    {index + 1}
                                </td>

                                <td className="py-4 px-6 font-mono text-indigo-600 font-medium text-xs">
                                    #{order._id.slice(-6)}
                                </td>
                                <td className="py-4 px-6 font-medium text-gray-800">{order?.email}</td>
                                
                                <td className="py-4 px-6 text-center">
                                    {/* FIXED: Applied currentStatus instead of order.status */}
                                    <span className={`px-3 py-1 text-[10px] font-bold text-white rounded-full shadow-sm ${getStatusColor(currentStatus.toLowerCase())}`}>
                                        {currentStatus.toUpperCase()}
                                    </span>
                                </td>

                                <td className="py-4 px-6 font-bold text-black-600">
                                    {/* ✅ Updated to Rs. and added locale string for better formatting */}
                                    Rs. {(order?.totalAmount || order?.amount || order?.price || 0).toLocaleString()}
                                </td>

                                <td className="py-4 px-6 text-gray-500 text-xs">{formatDate(order?.updatedAt)}</td>

                                <td className="py-4 px-6 flex justify-center items-center space-x-4">
                                    <button
                                        onClick={() => handleActionClick(order)}
                                        className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg font-bold text-[11px] border border-blue-100 transition-all"
                                    >
                                        VIEW / EDIT
                                    </button>

                                    <button
                                        onClick={() => handleDeleteClick(order?._id)}
                                        className="text-red-500 hover:text-red-700 transition-all p-1"
                                        title="Delete Order"
                                    >
                                        <i className="ri-delete-bin-line text-lg"></i>
                                    </button>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <UpdateOrderModal
                    order={selectedOrder}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'approved': return 'bg-green-600';
        case 'rejected': return 'bg-red-500';
        case 'pending': return 'bg-orange-500';
        case 'processing': return 'bg-blue-500';
        case 'shipped': return 'bg-indigo-500';
        case 'completed': return 'bg-green-600';
        default: return 'bg-gray-400';
    }
};

export default ManageOrders;