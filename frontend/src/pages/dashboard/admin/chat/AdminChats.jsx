import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi';

const AdminChats = () => {
    const navigate = useNavigate();
    const { data: orders, isLoading } = useGetAllOrdersQuery();
    const [chatList, setChatList] = useState([]);

    useEffect(() => {
        if (orders) {
            const manualOrders = orders.filter(o => o.paymentMethod === "Manual Payment");
            const updated = manualOrders.map(order => {
                const savedStatus = sessionStorage.getItem(`chat_${order._id}_status`);
                return {
                    id: order._id,
                    email: order.email,
                    amount: order.amount,
                    status: savedStatus || order.status
                };
            });
            setChatList(updated);
        }
    }, [orders]);

    if (isLoading) return <div className="p-10 text-center font-bold">Syncing...</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-black uppercase mb-8">Manual Payment Requests</h1>
            <div className="bg-white rounded-3xl border overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left p-5 font-bold text-gray-400 text-xs uppercase">Order ID</th>
                            <th className="text-left p-5 font-bold text-gray-400 text-xs uppercase">Customer</th>
                            <th className="text-left p-5 font-bold text-gray-400 text-xs uppercase">Status</th>
                            <th className="text-left p-5 font-bold text-gray-400 text-xs uppercase">Total</th>
                            <th className="text-left p-5 font-bold text-gray-400 text-xs uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chatList.map((chat) => (
                            <tr key={chat.id} className="border-b hover:bg-gray-50">
                                <td className="p-5 font-bold text-indigo-600">#{chat.id.slice(-6)}</td>
                                <td className="p-5 text-gray-600">{chat.email}</td>
                                <td className="p-5">
                                    <span className={`px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase ${chat.status === 'Approved' ? 'bg-green-600' : 'bg-orange-500'}`}>
                                        {chat.status}
                                    </span>
                                </td>
                                <td className="p-5 font-black">${chat.amount}</td>
                                <td className="p-5">
                                    <button onClick={() => navigate(`/dashboard/chats/${chat.id}`)} className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all">VIEW CHAT</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminChats;