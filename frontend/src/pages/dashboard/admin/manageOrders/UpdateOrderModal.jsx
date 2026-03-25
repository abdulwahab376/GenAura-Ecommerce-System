// import React, { useState } from 'react';
// import { useUpdateOrderStatusMutation } from '../../../../redux/features/orders/orderApi';

// const UpdateOrderModal = ({ order, onClose, isOpen }) => {
//     const [status, setStatus] = useState(order.status);
//     // console.log(order)
//     const [updateOrderStatus, { isLoading, error }] = useUpdateOrderStatusMutation();

//     const handleUpdate = async () => {
//         try {
//             await updateOrderStatus({ id: order._id, status }).unwrap();
//             onClose(); // Close the modal after successful update
//         } catch (err) {
//             console.error("Failed to update order status:", err);
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
//                 <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>
                
//                 <div className="mb-4">
//                     <label className="block text-gray-700 mb-2" htmlFor="status">Status</label>
//                     <select
//                         id="status"
//                         value={status}
//                         onChange={(e) => setStatus(e.target.value)}
//                         className="border border-gray-300 p-2 rounded w-full"
//                     >
//                         <option value="pending">Pending</option>
//                         <option value="processing">Processing</option>
//                         <option value="shipped">Shipped</option>
//                         <option value="completed">Completed</option>
//                     </select>
//                 </div>
                
//                 {error && <p className="text-red-500 mb-4">Failed to update status.</p>}
                
//                 <div className="flex justify-end space-x-2">
//                     <button
//                         onClick={onClose}
//                         className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleUpdate}
//                         disabled={isLoading}
//                         className="bg-blue-500 text-white px-4 py-2 rounded"
//                     >
//                         {isLoading ? 'Updating...' : 'Update'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UpdateOrderModal;


import React, { useState } from 'react';
import { useUpdateOrderStatusMutation } from '../../../../redux/features/orders/orderApi';
import { toast } from 'react-hot-toast';

const UpdateOrderModal = ({ order, isOpen, onClose }) => {
    const [status, setStatus] = useState(order?.status);
    const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();

    const totalItemsCount = order?.products?.reduce((acc, item) => acc + (item.quantity || 1), 0);

    const handleUpdate = async () => {
        try {
            await updateOrderStatus({ id: order?._id, status }).unwrap();
            toast.success("Order status updated!");
            onClose();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (!isOpen) return null;

    const fullName = `${order?.address?.firstName || ""} ${order?.address?.lastName || ""}`.trim() || "Guest User";
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div>
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Order Details</h2>
                        <p className="text-[10px] text-indigo-500 font-bold tracking-widest uppercase">{order?.orderId}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-3xl transition-colors">&times;</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Items Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <h3 className="font-bold text-gray-700 text-xs uppercase tracking-wider">Items Ordered</h3>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                {totalItemsCount} Units
                            </span>
                        </div>

                        <div className="space-y-2 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
                            {order?.products?.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                    <img src={item.image} alt="" className="w-10 h-10 object-cover rounded-lg shadow-sm bg-white" />
                                    <div className="flex-1">
                                        <p className="text-[11px] font-bold text-gray-800 line-clamp-1">{item.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Qty: {item.quantity} | ${item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2 space-y-2">
                            {/* Total Amount Box (Ab Black nahi hai) */}
                            <div className="flex justify-between p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                <span className="text-[10px] font-bold text-indigo-700 uppercase">Total Amount</span>
                                <span className="text-sm font-black text-indigo-900">${order?.amount || "0.00"}</span>
                            </div>
                            {/* Payment Method Box */}
                            <div className="flex justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                <span className="text-[10px] font-bold text-emerald-700 uppercase">Payment Method</span>
                                <span className="text-[11px] font-black text-emerald-900 uppercase">
                                    {order?.paymentMethod || "Not Specified"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Section */}
                    <div className="space-y-5">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <h3 className="font-bold text-gray-700 text-[10px] uppercase tracking-wider mb-3 pb-2 border-b border-slate-200">Shipping Info</h3>
                            
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Name:</span>
                                    <span className="font-bold text-gray-800">{fullName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Email:</span>
                                    <span className="font-medium text-gray-700">{order?.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Phone:</span>
                                    <span className="font-medium text-gray-700">{order?.phone}</span>
                                </div>
                                <div className="mt-3 pt-3 border-t border-dashed border-slate-200">
                                    <p className="text-gray-400 mb-1 font-semibold uppercase text-[9px]">Delivery Address:</p>
                                    <p className="text-gray-600 leading-relaxed italic">
                                        {order?.address?.street}, {order?.address?.city}, {order?.address?.state}, {order?.address?.country} ({order?.address?.zipCode}) <br />
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Order Status</label>
                            <div className="relative">
                                <select 
                                    value={status} 
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-white border-2 border-gray-100 p-3 rounded-xl text-xs font-bold text-gray-700 focus:border-indigo-500 transition-all outline-none cursor-pointer appearance-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="completed">Completed</option>
                                </select>
                                {/* Custom Dropdown Arrow */}
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={isLoading}
                            onClick={handleUpdate}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] disabled:bg-gray-300"
                        >
                            {isLoading ? "Saving..." : "Update Order"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateOrderModal;