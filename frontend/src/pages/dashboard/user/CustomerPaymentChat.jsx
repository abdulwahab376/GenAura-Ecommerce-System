import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Send, MessageSquare, Package } from 'lucide-react'; 
import { useGetOrdersByEmailQuery } from "../../../redux/features/orders/orderApi";

const CustomerPaymentChat = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    
    // Security: Only fetches orders tied to the logged-in user's email
    const { data: ordersData, isLoading } = useGetOrdersByEmailQuery(user?.email, {
        skip: !user?.email,
        pollingInterval: 5000 // Keeps checking for status updates from backend
    });
    
    const [selectedOrderId, setSelectedOrderId] = useState(id || null);
    const [messages, setMessages] = useState([]);
    const [chatStatus, setChatStatus] = useState('Pending');
    const [inputText, setInputText] = useState('');
    const [tick, setTick] = useState(0); // Heartbeat for live sidebar updates

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState(null);

    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);

    const ordersArray = Array.isArray(ordersData) ? ordersData : (ordersData?.orders || []);

    const manualOrders = ordersArray.filter(o => {
        const method = o.paymentMethod?.toLowerCase() || "";
        return method === "manual" || method.includes("easypaisa") || method.includes("jazzcash") || method.includes("bank") || method.includes("transfer");
    }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    useEffect(() => {
        if (!selectedOrderId && manualOrders.length > 0) {
            setSelectedOrderId(manualOrders[0]._id);
        }
    }, [manualOrders, selectedOrderId]);

    const activeOrder = manualOrders.find(o => o._id === selectedOrderId);
    const storageKey = activeOrder ? `chat_${activeOrder._id}_messages` : null;
    const statusKey = activeOrder ? `chat_${activeOrder._id}_status` : null;

    // Heartbeat for real-time sidebar badges
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    // Load active chat
    useEffect(() => {
        if (storageKey && activeOrder) {
            const stored = localStorage.getItem(storageKey);
            const status = localStorage.getItem(statusKey);
            
            // Mark chat as read by customer
            localStorage.setItem(`customer_read_${activeOrder._id}`, 'true');
            
            setChatStatus(status || activeOrder.status || 'Pending');
            setMessages(stored ? JSON.parse(stored) : [
                { id: 1, sender: 'admin', text: `Hello ${user?.username || 'Customer'}! Please complete your payment of Rs. ${(activeOrder.amount || activeOrder.totalAmount || 0).toLocaleString()} using:\n\n• Easypaisa: 03XXXXXXXXX\n• JazzCash: 03XXXXXXXXX\n• Bank Transfer: XXXX-XXXX-XXXX-XXXX\n\nAccount Title: Abdul Wahab\n\nAfter sending, please upload your receipt here.`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
            ]);
            cancelEdit();
        }
    }, [storageKey, activeOrder?._id]);

    // Live Sync Listener
    useEffect(() => {
        const channel = new BroadcastChannel('payment_sync');
        channel.onmessage = (event) => {
            if (event.data?.orderId) {
                if (event.data.orderId === activeOrder?._id && event.data.messages) {
                    setMessages(event.data.messages);
                    if (event.data.status) setChatStatus(event.data.status);
                    localStorage.setItem(`customer_read_${activeOrder._id}`, 'true');
                }
                setTick(t => t + 1); // Force sidebar to update Unread badges
            }
        };
        return () => channel.close();
    }, [activeOrder?._id]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (!selectedFile) return;
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [selectedFile]);

    const syncAndBroadcast = (updatedMessages) => {
        setMessages(updatedMessages);
        localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
        
        // Notify Admin that a new message arrived
        localStorage.setItem(`chat_read_${activeOrder._id}`, 'false');
        
        const channel = new BroadcastChannel('payment_sync');
        channel.postMessage({ orderId: activeOrder._id, messages: updatedMessages, status: chatStatus });
        channel.close();
    };

    const handleSendOrUpdate = (e) => {
        e.preventDefault();
        if (!inputText.trim() && !selectedFile && !previewUrl) return;

        if (editingMessageId) {
            if (selectedFile) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    syncAndBroadcast(messages.map(m => m.id === editingMessageId ? { ...m, text: inputText.trim(), imageUrl: reader.result } : m));
                    cancelEdit();
                };
                reader.readAsDataURL(selectedFile);
            } else {
                const finalImageUrl = previewUrl ? existingImageUrl : null;
                syncAndBroadcast(messages.map(m => m.id === editingMessageId ? { ...m, text: inputText.trim(), imageUrl: finalImageUrl } : m));
                cancelEdit();
            }
            return;
        }

        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const userMsg = { id: Date.now(), sender: 'user', text: inputText.trim(), imageUrl: reader.result, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
                syncAndBroadcast([...messages, userMsg]);
                cancelEdit();
            };
            reader.readAsDataURL(selectedFile);
        } else {
            const userMsg = { id: Date.now(), sender: 'user', text: inputText.trim(), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
            syncAndBroadcast([...messages, userMsg]);
            cancelEdit();
        }
    };

    const handleDelete = (id) => syncAndBroadcast(messages.filter(m => m.id !== id));

    const handleEdit = (msg) => {
        setEditingMessageId(msg.id);
        setInputText(msg.text || '');
        if (msg.imageUrl) { setPreviewUrl(msg.imageUrl); setExistingImageUrl(msg.imageUrl); } 
        else { setPreviewUrl(null); setExistingImageUrl(null); }
        setSelectedFile(null);
    };

    const cancelEdit = () => {
        setEditingMessageId(null);
        setInputText('');
        setSelectedFile(null);
        setPreviewUrl(null);
        setExistingImageUrl(null);
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center font-bold text-indigo-600 animate-pulse">Loading Your Chats...</div>;

    if (manualOrders.length === 0) return (
        <div className="p-10 text-center bg-white rounded-3xl shadow-sm border mt-10 max-w-md mx-auto">
            <MessageSquare className="mx-auto text-gray-300 mb-4" size={50} />
            <h2 className="text-xl font-bold text-gray-700">No Chats Found</h2>
            <Link to="/shop" className="mt-5 bg-indigo-600 text-white px-8 py-3 rounded-full font-bold inline-block hover:bg-indigo-700">Go to Shop</Link>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto h-[85vh] flex flex-col md:flex-row bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 mt-4">
            {/* Sidebar */}
            <div className="w-full md:w-[350px] bg-gray-50 border-r border-gray-200 flex flex-col h-1/3 md:h-full">
                <div className="p-6 bg-white border-b border-gray-100 flex items-center gap-3 shadow-sm">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-all"><ArrowLeft size={20} className="text-gray-600" /></button>
                    <h2 className="font-black text-gray-800 text-lg uppercase tracking-tight">Your Chats</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {manualOrders.map(order => {
                        const msgs = JSON.parse(localStorage.getItem(`chat_${order._id}_messages`) || '[]');
                        const isRead = localStorage.getItem(`customer_read_${order._id}`) === 'true';
                        const lastMsg = msgs[msgs.length - 1];
                        const hasUnread = lastMsg && lastMsg.sender === 'admin' && !isRead;

                        return (
                            <div key={order._id} onClick={() => setSelectedOrderId(order._id)} className={`p-5 border-b border-gray-100 cursor-pointer transition-all flex items-center gap-4 ${selectedOrderId === order._id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-white'}`}>
                                <div className={`p-3 rounded-full ${selectedOrderId === order._id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    <Package size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <h4 className={`text-sm font-bold ${selectedOrderId === order._id ? 'text-indigo-900' : 'text-gray-700'}`}>Order #{order._id.slice(-6)}</h4>
                                        {hasUnread && <span className="bg-red-500 w-2.5 h-2.5 rounded-full animate-pulse"></span>}
                                    </div>
                                    <div className="flex justify-between items-center mt-1 text-xs">
                                        <span className="text-gray-500 font-medium">Rs. {(order.amount || order.totalAmount || 0).toLocaleString()}</span>
                                        <span className={`font-bold px-2 py-0.5 rounded-full text-[9px] uppercase ${order.status === 'Approved' ? 'bg-green-100 text-green-700' : order.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{order.status}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chat Window */}
            {activeOrder ? (
                <div className="flex-1 flex flex-col h-2/3 md:h-full relative bg-[#F8FAFC]">
                    <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white flex justify-between items-center shadow-md z-10">
                        <div>
                            <h3 className="font-black text-lg">Support Agent</h3>
                            <p className="text-[10px] text-white/80 tracking-widest uppercase">Order: {activeOrder._id.slice(-6)}</p>
                        </div>
                        <div className="hidden sm:flex flex-col items-end text-[10px] font-bold bg-black/10 px-4 py-2 rounded-2xl border border-white/10">
                            <span className="opacity-70 uppercase tracking-tighter">Status</span>
                            <span className="text-yellow-300 uppercase">{chatStatus}</span>
                        </div>
                    </div>

                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} group`}>
                                    <div className={`p-4 rounded-3xl shadow-sm text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-indigo-50 border border-indigo-100 text-gray-700 rounded-tl-none'}`}>
                                        {msg.imageUrl && <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer"><img src={msg.imageUrl} alt="Attachment" className="max-w-[200px] rounded-lg mb-2 border border-white/20 cursor-pointer hover:opacity-90" /></a>}
                                        {msg.text && <p className="whitespace-pre-line">{msg.text}</p>}
                                    </div>
                                    <span className="text-[9px] mt-1 font-bold text-gray-400 px-2 uppercase">{msg.time || 'Sent'}</span>
                                    {msg.sender === 'user' && (
                                        <div className="flex gap-3 mt-1 text-[10px] font-bold text-gray-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity px-1">
                                            <button onClick={() => handleEdit(msg)} className="hover:text-indigo-600">✏️ Edit</button>
                                            <button onClick={() => handleDelete(msg.id)} className="hover:text-red-500">🗑️ Delete</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-white border-t border-gray-100 z-10">
                        {previewUrl && (
                            <div className="mb-3 relative inline-block border-2 border-dashed border-indigo-300 p-2 rounded-xl bg-indigo-50">
                                <img src={previewUrl} alt="Preview" className="h-24 object-contain rounded-lg shadow-sm" />
                                <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="absolute -top-3 -right-3 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-md font-bold text-xs hover:bg-red-600">✕</button>
                            </div>
                        )}
                        <form onSubmit={handleSendOrUpdate} className="flex flex-col gap-2">
                            {editingMessageId && (
                                <div className="flex justify-between items-center bg-yellow-50 text-yellow-800 text-xs px-3 py-2 rounded-lg font-medium border border-yellow-200">
                                    <span>Editing message...</span>
                                    <button type="button" onClick={cancelEdit} className="text-red-500 font-bold hover:underline">Cancel</button>
                                </div>
                            )}
                            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-[2rem] border border-gray-200 focus-within:ring-2 ring-indigo-100 transition-all shadow-inner">
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 rounded-full text-gray-500 hover:bg-white hover:text-indigo-600 transition-colors shadow-sm text-lg ml-1">📎</button>
                                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={editingMessageId ? "Edit your message..." : "Type your message here..."} className="flex-1 bg-transparent p-2 outline-none text-sm text-gray-700 placeholder-gray-400" />
                                <button type="submit" disabled={!inputText.trim() && !selectedFile && !previewUrl} className={`p-4 rounded-full shadow-lg transition-all ${!inputText.trim() && !selectedFile && !previewUrl ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'}`}><Send size={20} /></button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default CustomerPaymentChat;