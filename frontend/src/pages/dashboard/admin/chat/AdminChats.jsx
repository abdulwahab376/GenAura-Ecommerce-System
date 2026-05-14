// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi';
// import { MessageSquare } from 'lucide-react';
// import io from "socket.io-client";

// const socket = io("http://localhost:5000");

// const AdminChats = () => {
//     const navigate = useNavigate();
//     const [chatNotifications, setChatNotifications] = useState([]);
//     const [chatList, setChatList] = useState([]);

//     const { data: orders, isLoading } = useGetAllOrdersQuery(undefined, {
//         pollingInterval: 15000, 
//         refetchOnMountOrArgChange: true
//     });

//     const fetchChatStatuses = async () => {
//         try {
//             const response = await fetch("http://localhost:5000/api/chats/admin/all-statuses");
//             const data = await response.json();
//             setChatNotifications(Array.isArray(data) ? data : []);
//         } catch (error) {
//             console.error("Error fetching chat statuses:", error);
//         }
//     };

//     useEffect(() => {
//         fetchChatStatuses();
//         socket.on("admin_notification", () => {
//             fetchChatStatuses(); 
//         });
//         return () => socket.off("admin_notification");
//     }, []);

//     useEffect(() => {
//         if (orders) {
//             const ordersArray = Array.isArray(orders) ? orders : (orders?.orders || []);
            
//             const manualOrders = ordersArray.filter(o => 
//                 ["manual", "easypaisa", "jazzcash", "bank"].some(m => o.paymentMethod?.toLowerCase().includes(m))
//             );

//             const updated = manualOrders.map(order => {
//                 const dbChat = chatNotifications.find(c => String(c.orderId) === String(order._id));
//                 const count = (dbChat && dbChat.unreadCount) ? Number(dbChat.unreadCount) : 0;
//                 const hasUnread = !!(dbChat && dbChat.hasUnread && count > 0);

//                 return {
//                     id: order._id,
//                     email: order.email,
//                     amount: order.amount || order.totalAmount,
//                     status: order.status,
//                     hasUnread: hasUnread,
//                     unreadCount: count,
//                 };
//             });

//             updated.sort((a, b) => b.unreadCount - a.unreadCount);
//             setChatList(updated);
//         }
//     }, [orders, chatNotifications]);

//     const handleViewChat = async (id) => {
//         try {
//             setChatList(prev => prev.map(c => c.id === id ? { ...c, hasUnread: false, unreadCount: 0 } : c));
//             await fetch(`http://localhost:5000/api/chats/mark-as-read/${id}`, { method: 'PATCH' });
//             window.dispatchEvent(new Event('refresh_unread_count'));
//             navigate(`/dashboard/chats/${id}`);
//         } catch (error) {
//             console.error("Error marking as read:", error);
//         }
//     };

//     if (isLoading) return <div className="p-10 text-center font-bold animate-pulse text-indigo-600">Syncing Payment Chats...</div>;

//     return (
//         <div className="p-4 md:p-8">
//             <div className="flex items-center gap-3 mb-8">
//                 <span className="text-indigo-600"><MessageSquare size={28} /></span>
//                 <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-900">Manual Payment Requests</h1>
//             </div>

//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm min-w-[600px]">
//                         <thead className="bg-slate-50 border-b border-gray-100">
//                             <tr>
//                                 <th className="p-4 text-left font-bold text-slate-500 text-xs uppercase">Order ID</th>
//                                 <th className="p-4 text-left font-bold text-slate-500 text-xs uppercase">Customer</th>
//                                 <th className="p-4 text-left font-bold text-slate-500 text-xs uppercase">Status</th>
//                                 <th className="p-4 text-left font-bold text-slate-500 text-xs uppercase">Total</th>
//                                 <th className="p-4 text-left font-bold text-slate-500 text-xs uppercase">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {chatList.map((chat) => (
//                                 <tr key={chat.id} className={`border-b border-gray-50 transition-all ${chat.hasUnread ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}`}>
//                                     <td className="p-4 font-bold text-indigo-600">
//                                         #{chat.id.slice(-6)}
//                                     </td>
//                                     <td className="p-4">
//                                         <div className="flex items-center gap-3">
//                                             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${chat.hasUnread ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
//                                                 {chat.email?.charAt(0).toUpperCase()}
//                                             </div>
//                                             <span className={chat.hasUnread ? 'font-black text-slate-900' : 'text-slate-600'}>{chat.email}</span>
//                                         </div>
//                                     </td>
//                                     <td className="p-4">
//                                         <span className={`px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase ${chat.status?.toLowerCase() === 'approved' ? 'bg-green-500' : chat.status?.toLowerCase() === 'rejected' ? 'bg-red-500' : 'bg-orange-500'}`}>
//                                             {chat.status}
//                                         </span>
//                                     </td>
//                                     <td className="p-4 font-black text-slate-900">Rs. {Number(chat.amount).toLocaleString()}</td>
//                                     <td className="p-4">
//                                         {/* Button Wrapper to handle corner notification */}
//                                         <div className="relative inline-block">
//                                             <button
//                                                 onClick={() => handleViewChat(chat.id)}
//                                                 className={`border px-4 py-2 rounded-xl text-xs font-bold transition-all ${chat.hasUnread ? 'bg-indigo-600 border-indigo-600 text-white shadow-md scale-105' : 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
//                                             >
//                                                 {chat.hasUnread ? `REPLY` : 'VIEW CHAT'}
//                                             </button>

//                                             {/* Corner Notification Badge */}
//                                             {chat.hasUnread && (
//                                                 <span className="absolute -top-2 -right-2 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold min-w-[20px] h-[20px] rounded-full px-1 animate-bounce ring-2 ring-white">
//                                                     {chat.unreadCount}
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminChats;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi';
import { MessageSquare, Trash2 } from 'lucide-react'; // Trash2 import kiya
import io from "socket.io-client";
import { toast } from 'react-hot-toast';

const socket = io("http://localhost:5000");

const AdminChats = () => {
    const navigate = useNavigate();
    const [chatNotifications, setChatNotifications] = useState([]);
    const [chatList, setChatList] = useState([]);

    const { data: orders, isLoading, refetch } = useGetAllOrdersQuery(undefined, {
        pollingInterval: 15000, 
        refetchOnMountOrArgChange: true
    });

    const fetchChatStatuses = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/chats/admin/all-statuses");
            const data = await response.json();
            setChatNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching chat statuses:", error);
        }
    };

    // --- Naya Delete Function ---
    const handleDeleteChat = async (e, id) => {
        e.stopPropagation(); // Card click event ko rokne ke liye
        if (!window.confirm("Are you sure you want to delete this chat history?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/chats/delete-chat/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success("Chat deleted successfully");
                // List ko foran update karne ke liye
                setChatList(prev => prev.filter(chat => chat.id !== id));
                fetchChatStatuses();
                refetch(); // Orders data refresh karne ke liye
            } else {
                toast.error("Failed to delete chat");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error("Server error while deleting");
        }
    };

    useEffect(() => {
        fetchChatStatuses();
        socket.on("admin_notification", () => {
            fetchChatStatuses(); 
        });
        return () => socket.off("admin_notification");
    }, []);

    useEffect(() => {
        if (orders) {
            const ordersArray = Array.isArray(orders) ? orders : (orders?.orders || []);
            const manualOrders = ordersArray.filter(o => 
                ["manual", "easypaisa", "jazzcash", "bank"].some(m => o.paymentMethod?.toLowerCase().includes(m))
            );

            const updated = manualOrders.map(order => {
                const dbChat = chatNotifications.find(c => String(c.orderId) === String(order._id));
                const count = (dbChat && dbChat.unreadCount) ? Number(dbChat.unreadCount) : 0;
                const hasUnread = !!(dbChat && dbChat.hasUnread && count > 0);

                return {
                    id: order._id,
                    email: order.email,
                    amount: order.amount || order.totalAmount,
                    status: order.status,
                    hasUnread: hasUnread,
                    unreadCount: count,
                };
            });

            updated.sort((a, b) => b.unreadCount - a.unreadCount);
            setChatList(updated);
        }
    }, [orders, chatNotifications]);

    const handleViewChat = async (id) => {
        try {
            setChatList(prev => prev.map(c => c.id === id ? { ...c, hasUnread: false, unreadCount: 0 } : c));
            await fetch(`http://localhost:5000/api/chats/mark-as-read/${id}`, { method: 'PATCH' });
            window.dispatchEvent(new Event('refresh_unread_count'));
            navigate(`/dashboard/chats/${id}`);
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    if (isLoading) return <div className="p-10 text-center font-bold animate-pulse text-indigo-600">Syncing Payment Chats...</div>;

    return (
        <div className="p-4 md:p-8">
            <div className="flex items-center gap-3 mb-8">
                <span className="text-indigo-600"><MessageSquare size={28} /></span>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-900">Manual Payment Requests</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                        <thead className="bg-slate-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-left font-bold text-slate-500 text-xs uppercase">Order ID</th>
                                <th className="p-4 text-left font-bold text-slate-500 text-xs uppercase">Customer</th>
                                <th className="p-4 text-left font-bold text-slate-500 text-xs uppercase">Status</th>
                                <th className="p-4 text-left font-bold text-slate-500 text-xs uppercase">Total</th>
                                <th className="p-4 text-center font-bold text-slate-500 text-xs uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chatList.map((chat) => (
                                <tr key={chat.id} className={`border-b border-gray-50 transition-all ${chat.hasUnread ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}`}>
                                    <td className="p-4 font-bold text-indigo-600">#{chat.id.slice(-6)}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${chat.hasUnread ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                                {chat.email?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className={chat.hasUnread ? 'font-black text-slate-900' : 'text-slate-600'}>{chat.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase ${chat.status?.toLowerCase() === 'approved' ? 'bg-green-500' : chat.status?.toLowerCase() === 'rejected' ? 'bg-red-500' : 'bg-orange-500'}`}>
                                            {chat.status}
                                        </span>
                                    </td>
                                    <td className="p-4 font-black text-slate-900">Rs. {Number(chat.amount).toLocaleString()}</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-3">
                                            {/* View/Reply Button */}
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() => handleViewChat(chat.id)}
                                                    className={`border px-4 py-2 rounded-xl text-xs font-bold transition-all ${chat.hasUnread ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
                                                >
                                                    {chat.hasUnread ? `REPLY` : 'VIEW'}
                                                </button>
                                                {chat.hasUnread && (
                                                    <span className="absolute -top-2 -right-2 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full px-1 animate-bounce ring-2 ring-white">
                                                        {chat.unreadCount}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Delete Button */}
                                            <button 
                                                onClick={(e) => handleDeleteChat(e, chat.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete Chat History"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminChats;