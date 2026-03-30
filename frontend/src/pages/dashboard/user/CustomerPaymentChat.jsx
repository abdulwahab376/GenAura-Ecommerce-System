import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Send, CheckCircle, MessageSquare, Clock } from 'lucide-react'; 
import { useGetOrdersByEmailQuery } from "../../../redux/features/orders/orderApi";

const CustomerPaymentChat = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    
    const { data: ordersData, isLoading } = useGetOrdersByEmailQuery(user?.email, {
        skip: !user?.email
    });
    
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    // ✅ Updated Logic: Ab ye har us order ko utha lega jo manual payment hai
    const activeOrder = id 
        ? ordersData?.orders?.find(o => o._id === id) 
        : ordersData?.orders?.find(o => {
            const method = o.paymentMethod?.toLowerCase() || "";
            // Agar method 'manual' hai YA us mein 'easy/jazz/bank' ka zikr hai
            return (
                method === "manual" || 
                method.includes("easypaisa") || 
                method.includes("jazzcash") || 
                method.includes("bank") ||
                method.includes("transfer")
            );
        }) || ordersData?.orders?.[0]; // Kuch na mile to latest order

    const activeOrderId = activeOrder?._id;
    const storageKey = activeOrderId ? `chat_${activeOrderId}_messages` : null;

    // Initial Load
    useEffect(() => {
        if (storageKey) {
            const stored = localStorage.getItem(storageKey);
            setMessages(stored ? JSON.parse(stored) : [
                { 
                    id: 1, 
                    sender: 'admin', 
                    text: `Asalam-o-Alaikum ${user?.username || 'Customer'}! Please upload your payment proof for Order #${activeOrderId?.slice(-6)}.`,
                    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                }
            ]);
        }
    }, [storageKey, activeOrderId, user?.username]);

    // ✅ Fast Sync Logic (Admin ke message foran dikhane ke liye)
    useEffect(() => {
        const interval = setInterval(() => {
            if (storageKey) {
                const storedRaw = localStorage.getItem(storageKey);
                if (storedRaw) {
                    const parsed = JSON.parse(storedRaw);
                    if (parsed.length !== messages.length) {
                        setMessages(parsed);
                    }
                }
            }
        }, 800); // 1 second se kam taake fast sync ho
        return () => clearInterval(interval);
    }, [storageKey, messages.length]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputText.trim() || !storageKey) return;
        
        const newMsg = { 
            id: Date.now(), 
            sender: 'user', 
            text: inputText.trim(), 
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
        };
        
        // Latest storage se sync karke bhejain taake message miss na ho
        const currentStored = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updated = [...currentStored, newMsg];
        
        setMessages(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        
        const channel = new BroadcastChannel('payment_sync');
        channel.postMessage({ orderId: activeOrderId, action: 'new_message' });
        setInputText('');
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center font-bold text-indigo-600 italic animate-pulse">Checking Orders...</div>;

    if (!activeOrderId) return (
        <div className="p-10 text-center bg-white rounded-3xl shadow-sm border mt-10 max-w-md mx-auto">
            <MessageSquare className="mx-auto text-gray-300 mb-4" size={50} />
            <h2 className="text-xl font-bold text-gray-700">No Orders Found</h2>
            <p className="text-gray-500 mb-5 text-sm">Please place an order using Manual Payment to start chat.</p>
            <Link to="/shop" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold inline-block hover:bg-indigo-700 transition-all">Go to Shop</Link>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto h-[85vh] flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 mt-4">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h3 className="font-black text-lg">Support Agent</h3>
                        <p className="text-[10px] text-white/80 tracking-widest uppercase">Order: {activeOrderId.slice(-8)}</p>
                    </div>
                </div>
                <div className="hidden sm:flex flex-col items-end text-[10px] font-bold bg-black/10 px-4 py-2 rounded-2xl border border-white/10">
                    <span className="opacity-70 uppercase tracking-tighter">Status</span>
                    <span className="text-yellow-300 uppercase">{activeOrder?.status || 'Processing'}</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-4 rounded-3xl shadow-sm text-sm leading-relaxed ${
                                msg.sender === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-white text-gray-700 border border-gray-200 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                            <span className="text-[9px] mt-1 font-bold text-gray-400 px-2 uppercase">
                                {msg.time || 'now'}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-gray-50">
                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-[2rem] border border-gray-100 focus-within:ring-2 ring-indigo-100 transition-all">
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message here..." 
                        className="flex-1 bg-transparent p-3 outline-none text-sm text-gray-700"
                    />
                    <button onClick={handleSendMessage} className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 active:scale-95 transition-all">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerPaymentChat;