import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi';
import { MessageSquare } from 'lucide-react';

const AdminChats = () => {
    const navigate = useNavigate();

    const { data: orders, isLoading } = useGetAllOrdersQuery(undefined, {
        pollingInterval: 5000,
        refetchOnMountOrArgChange: true
    });

    const [chatList, setChatList] = useState([]);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const channel = new BroadcastChannel('payment_sync');
        channel.onmessage = (event) => {
            if (event.data?.messages && event.data?.orderId) {
                // Ensure data saves to local storage so table reads it perfectly
                localStorage.setItem(`chat_${event.data.orderId}_messages`, JSON.stringify(event.data.messages));
                localStorage.setItem(`chat_${event.data.orderId}_status`, event.data.status);
                localStorage.setItem(`chat_read_${event.data.orderId}`, 'false');
            }
            setTick(t => t + 1);
        };
        return () => channel.close();
    }, []);

    // Listen for storage changes from other tabs naturally
    useEffect(() => {
        const handleStorageChange = () => setTick(t => t + 1);
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        if (orders) {
            const ordersArray = Array.isArray(orders) ? orders : (orders?.orders || []);
            const manualOrders = ordersArray.filter(o => o.paymentMethod === "Manual Payment");

            const updated = manualOrders.map(order => {
                // ✅ Pulling exclusively from permanent localStorage
                const savedStatus = localStorage.getItem(`chat_${order._id}_status`);
                const msgs = JSON.parse(localStorage.getItem(`chat_${order._id}_messages`) || '[]');
                const isRead = localStorage.getItem(`chat_read_${order._id}`) === 'true';

                // Unread calculation: Has the user uploaded a receipt (msgs > 1) and is it unread?
                const unreadCount = (!isRead && msgs.length > 1) ? (msgs.length - 1) : 0;

                return {
                    id: order._id,
                    email: order.email,
                    amount: order.amount || order.totalAmount,
                    status: savedStatus || order.status,
                    unreadCount: unreadCount
                };
            });

            updated.sort((a, b) => b.unreadCount - a.unreadCount);
            setChatList(updated);
        }
    }, [orders, tick]);

    const handleViewChat = (id) => {
        // Mark as read in global storage
        localStorage.setItem(`chat_read_${id}`, 'true');
        navigate(`/dashboard/chats/${id}`);
    };

    if (isLoading) return <div className="p-10 text-center font-bold animate-pulse text-indigo-600">Syncing Chats...</div>;

    return (
        <div className="p-4 md:p-8">
            <div className="flex items-center gap-3 mb-8">
                <MessageSquare size={28} className="text-indigo-600" />
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-900">Manual Payment Requests</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                        <thead className="bg-slate-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Order ID</th>
                                <th className="text-left p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Customer</th>
                                <th className="text-left p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                                <th className="text-left p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Total</th>
                                <th className="text-left p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chatList.map((chat) => {
                                const isUnread = chat.unreadCount > 0;

                                return (
                                    <tr
                                        key={chat.id}
                                        className={`border-b border-gray-50 transition-colors ${isUnread ? 'bg-indigo-50/60 hover:bg-indigo-50' : 'hover:bg-slate-50'}`}
                                    >
                                        <td className="p-4 font-bold text-indigo-600">
                                            <div className="flex items-center gap-2">
                                                #{chat.id.slice(-6)}
                                                {isUnread && (
                                                    <span className="flex h-3 w-3 relative">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isUnread ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 text-slate-600'}`}>
                                                    {chat.email.charAt(0).toUpperCase()}
                                                </div>
                                                <span className={isUnread ? 'font-black text-slate-900' : 'text-slate-600'}>
                                                    {chat.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider shadow-sm ${chat.status.toLowerCase() === 'approved' ? 'bg-green-500' : chat.status.toLowerCase() === 'rejected' ? 'bg-red-500' : 'bg-orange-500'}`}>
                                                {chat.status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-black text-slate-900">${chat.amount}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleViewChat(chat.id)}
                                                className={`relative border px-4 py-2 rounded-xl text-xs font-bold transition-all ${isUnread
                                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:shadow-lg'
                                                        : 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                                                    }`}
                                            >
                                                {isUnread ? 'REPLY NOW' : 'VIEW CHAT'}

                                                {isUnread && (
                                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-bounce">
                                                        {chat.unreadCount}
                                                    </span>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminChats;