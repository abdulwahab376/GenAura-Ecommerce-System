// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi';
// import { MessageSquare } from 'lucide-react';

// const AdminChats = () => {
//     const navigate = useNavigate();

//     const { data: orders, isLoading } = useGetAllOrdersQuery(undefined, {
//         pollingInterval: 5000,
//         refetchOnMountOrArgChange: true
//     });

//     const [chatList, setChatList] = useState([]);
//     const [tick, setTick] = useState(0);

//     // Heartbeat for instant UI updates
//     useEffect(() => {
//         const interval = setInterval(() => setTick(t => t + 1), 1000);
//         return () => clearInterval(interval);
//     }, []);

//     // Listen for new messages via BroadcastChannel
//     useEffect(() => {
//         const channel = new BroadcastChannel('payment_sync');
//         channel.onmessage = (event) => {
//             if (event.data?.messages && event.data?.orderId) {
//                 localStorage.setItem(`chat_${event.data.orderId}_messages`, JSON.stringify(event.data.messages));
//                 localStorage.setItem(`chat_${event.data.orderId}_status`, event.data.status);
//                 setTick(t => t + 1);
//             }
//         };
//         return () => channel.close();
//     }, []);

//     useEffect(() => {
//         if (orders) {
//             const ordersArray = Array.isArray(orders) ? orders : (orders?.orders || []);
//             const manualOrders = ordersArray.filter(o => o.paymentMethod?.toLowerCase().includes("manual") || o.paymentMethod?.toLowerCase().includes("easypaisa") || o.paymentMethod?.toLowerCase().includes("jazzcash") || o.paymentMethod?.toLowerCase().includes("bank"));

//             const updated = manualOrders.map(order => {
//                 const savedStatus = localStorage.getItem(`chat_${order._id}_status`);
//                 const msgs = JSON.parse(localStorage.getItem(`chat_${order._id}_messages`) || '[]');
                
//                 // Has Admin Read It?
//                 const isRead = localStorage.getItem(`chat_read_${order._id}`) === 'true';
//                 const lastMsg = msgs[msgs.length - 1];
//                 const hasUnread = lastMsg && lastMsg.sender === 'user' && !isRead;

//                 return {
//                     id: order._id,
//                     email: order.email,
//                     amount: order.amount || order.totalAmount,
//                     status: savedStatus || order.status,
//                     hasUnread: hasUnread,
//                     unreadCount: hasUnread ? 1 : 0 // Simplified Unread Indicator
//                 };
//             });

//             // Sort: Unread messages hamesha upar rahein
//             updated.sort((a, b) => (b.hasUnread ? 1 : 0) - (a.hasUnread ? 1 : 0));
//             setChatList(updated);
//         }
//     }, [orders, tick]);

//     const handleViewChat = (id) => {
//         localStorage.setItem(`chat_read_${id}`, 'true');
//         setTick(t => t + 1);
//         navigate(`/dashboard/chats/${id}`);
//     };

//     if (isLoading) return <div className="p-10 text-center font-bold animate-pulse text-indigo-600">Syncing Chats...</div>;

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
//                                 <th className="text-left p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Order ID</th>
//                                 <th className="text-left p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Customer</th>
//                                 <th className="text-left p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Status</th>
//                                 <th className="text-left p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Total</th>
//                                 <th className="text-left p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {chatList.map((chat) => (
//                                 <tr key={chat.id} className={`border-b border-gray-50 transition-all ${chat.hasUnread ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}`}>
//                                     <td className="p-4 font-bold text-indigo-600">
//                                         <div className="flex items-center gap-2">
//                                             #{chat.id.slice(-6)}
//                                             {chat.hasUnread && (
//                                                 <span className="flex h-3 w-3 relative">
//                                                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                                                     <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </td>
//                                     <td className="p-4">
//                                         <div className="flex items-center gap-3">
//                                             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${chat.hasUnread ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
//                                                 {chat.email.charAt(0).toUpperCase()}
//                                             </div>
//                                             <span className={chat.hasUnread ? 'font-black text-slate-900' : 'text-slate-600'}>{chat.email}</span>
//                                         </div>
//                                     </td>
//                                     <td className="p-4">
//                                         <span className={`px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider shadow-sm ${chat.status?.toLowerCase() === 'approved' ? 'bg-green-500' : chat.status?.toLowerCase() === 'rejected' ? 'bg-red-500' : 'bg-orange-500'}`}>
//                                             {chat.status}
//                                         </span>
//                                     </td>
//                                     <td className="p-4 font-black text-slate-900">Rs. {Number(chat.amount).toLocaleString()}</td>
//                                     <td className="p-4">
//                                         <button
//                                             onClick={() => handleViewChat(chat.id)}
//                                             className={`relative border px-4 py-2 rounded-xl text-xs font-bold transition-all ${chat.hasUnread ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
//                                         >
//                                             {chat.hasUnread ? 'REPLY NOW' : 'VIEW CHAT'}
//                                             {chat.hasUnread && (
//                                                 <span className="absolute -top-2 -right-2 bg-red-500 text-white w-4 h-4 rounded-full animate-bounce shadow-md"></span>
//                                             )}
//                                         </button>
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
import { MessageSquare } from 'lucide-react';
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const AdminChats = () => {
    const navigate = useNavigate();
    const [chatNotifications, setChatNotifications] = useState([]);
    const [chatList, setChatList] = useState([]);

    const { data: orders, isLoading } = useGetAllOrdersQuery(undefined, {
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
                                <th className="p-4 text-left font-bold text-slate-500 text-xs uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chatList.map((chat) => (
                                <tr key={chat.id} className={`border-b border-gray-50 transition-all ${chat.hasUnread ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}`}>
                                    <td className="p-4 font-bold text-indigo-600">
                                        #{chat.id.slice(-6)}
                                    </td>
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
                                        {/* Button Wrapper to handle corner notification */}
                                        <div className="relative inline-block">
                                            <button
                                                onClick={() => handleViewChat(chat.id)}
                                                className={`border px-4 py-2 rounded-xl text-xs font-bold transition-all ${chat.hasUnread ? 'bg-indigo-600 border-indigo-600 text-white shadow-md scale-105' : 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
                                            >
                                                {chat.hasUnread ? `REPLY` : 'VIEW CHAT'}
                                            </button>

                                            {/* Corner Notification Badge */}
                                            {chat.hasUnread && (
                                                <span className="absolute -top-2 -right-2 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold min-w-[20px] h-[20px] rounded-full px-1 animate-bounce ring-2 ring-white">
                                                    {chat.unreadCount}
                                                </span>
                                            )}
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