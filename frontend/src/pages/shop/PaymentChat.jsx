import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentChat = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const amount = location.state?.amount || 0;
    const orderId = location.state?.orderId || "c1";

    const storageKey = `chat_${orderId}_messages`;
    const statusKey = `chat_${orderId}_status`;
    const channel = new BroadcastChannel('payment_sync');

    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);

    // ✅ Updated Instructions with JazzCash and Account Title
    const initialAdminMessage = {
        id: 1,
        sender: 'admin',
        text: `Hello! Please complete your payment of Rs. ${amount.toLocaleString()} using:

• Easypaisa: 03XXXXXXXXX
• JazzCash: 03XXXXXXXXX
• Bank Transfer: XXXX-XXXX-XXXX-XXXX

Account Title: Abdul Wahab

After sending, please upload your receipt here.`
    };

    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : [initialAdminMessage];
    });

    const [status, setStatus] = useState(() => localStorage.getItem(statusKey) || 'Pending');
    const [inputText, setInputText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [editingMessageId, setEditingMessageId] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState(null);

    useEffect(() => {
        channel.onmessage = (event) => {
            if (event.data?.messages && event.data?.orderId === orderId) {
                setMessages(event.data.messages);
                setStatus(event.data.status);
                localStorage.setItem(storageKey, JSON.stringify(event.data.messages));
                localStorage.setItem(statusKey, event.data.status);
            }
        };
        return () => channel.close();
    }, [orderId, storageKey, statusKey]);

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
        channel.postMessage({
            orderId: orderId,
            messages: updatedMessages,
            status: status
        });
    };

    const handleSendOrUpdate = (e) => {
        e.preventDefault();
        if (!inputText.trim() && !selectedFile && !previewUrl) return;

        if (editingMessageId) {
            if (selectedFile) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const updated = messages.map(m =>
                        m.id === editingMessageId ? { ...m, text: inputText.trim(), imageUrl: reader.result } : m
                    );
                    syncAndBroadcast(updated);
                    cancelEdit();
                };
                reader.readAsDataURL(selectedFile);
                return;
            } else {
                const finalImageUrl = previewUrl ? existingImageUrl : null;
                const updated = messages.map(m =>
                    m.id === editingMessageId ? { ...m, text: inputText.trim(), imageUrl: finalImageUrl } : m
                );
                syncAndBroadcast(updated);
                cancelEdit();
                return;
            }
        }

        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const userMsg = { id: Date.now(), sender: 'user', text: inputText.trim(), imageUrl: reader.result };
                syncAndBroadcast([...messages, userMsg]);
                setSelectedFile(null);
                setPreviewUrl(null);
                setInputText('');
            };
            reader.readAsDataURL(selectedFile);
        } else {
            const userMsg = { id: Date.now(), sender: 'user', text: inputText.trim() };
            syncAndBroadcast([...messages, userMsg]);
            setInputText('');
        }
    };

    const handleDelete = (id) => {
        const updated = messages.filter(m => m.id !== id);
        syncAndBroadcast(updated);
    };

    const handleEdit = (msg) => {
        setEditingMessageId(msg.id);
        setInputText(msg.text || '');
        if (msg.imageUrl) {
            setPreviewUrl(msg.imageUrl);
            setExistingImageUrl(msg.imageUrl);
        } else {
            setPreviewUrl(null);
            setExistingImageUrl(null);
        }
        setSelectedFile(null);
    };

    const handleClearChat = () => {
        if (window.confirm("Are you sure you want to clear this chat?")) {
            syncAndBroadcast([initialAdminMessage]);
        }
    };

    const cancelEdit = () => {
        setEditingMessageId(null);
        setInputText('');
        setSelectedFile(null);
        setPreviewUrl(null);
        setExistingImageUrl(null);
    };

    return (
        <section className="min-h-screen py-10 px-4 bg-white font-sans">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => navigate(-1)} className="text-sm font-semibold text-indigo-600">← Back</button>
                    {status === 'Approved' && (
                        <button onClick={() => navigate('/shop')} className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg animate-bounce">Buy More Stuff →</button>
                    )}
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col h-[80vh]">
                    <div className="flex justify-between items-center mb-4 border-b pb-3">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-extrabold uppercase text-gray-900">Payment Chat</h2>
                            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">{status}</span>
                        </div>
                        <button onClick={handleClearChat} className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                            🧹 Clear Chat
                        </button>
                    </div>

                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} group`}>
                                    
                                    {/* ✅ Added bg-indigo-50 for Admin messages for a light color background */}
                                    <div className={`p-3 rounded-xl text-sm shadow-sm ${msg.sender === 'admin' ? 'bg-indigo-50 border-indigo-100 border text-gray-700' : 'bg-indigo-600 text-white'}`}>
                                        {msg.imageUrl && (
                                            <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                                                <img src={msg.imageUrl} alt="Receipt" className="max-w-[200px] rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity" />
                                            </a>
                                        )}
                                        {msg.text && <p className="whitespace-pre-line">{msg.text}</p>}
                                    </div>

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

                    {previewUrl && (
                        <div className="mb-3 relative inline-block border-2 border-dashed border-indigo-300 p-2 rounded-xl bg-indigo-50">
                            <img src={previewUrl} alt="Preview" className="h-24 object-contain rounded-lg shadow-sm" />
                            <button
                                type="button"
                                onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                                className="absolute -top-3 -right-3 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-md font-bold text-xs hover:bg-red-600"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSendOrUpdate} className="flex flex-col gap-2">
                        {editingMessageId && (
                            <div className="flex justify-between items-center bg-yellow-50 text-yellow-800 text-xs px-3 py-2 rounded-lg font-medium border border-yellow-200">
                                <span>Editing message...</span>
                                <button type="button" onClick={cancelEdit} className="text-red-500 font-bold hover:underline">Cancel</button>
                            </div>
                        )}

                        <div className="flex gap-2 items-center">
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3.5 rounded-xl border bg-white text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm text-lg">
                                📎
                            </button>

                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={editingMessageId ? "Edit your message..." : "Type a message..."}
                                className="w-full border p-3.5 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                            />

                            <button
                                type="submit"
                                disabled={!inputText.trim() && !selectedFile && !previewUrl}
                                className={`py-3.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-sm ${!inputText.trim() && !selectedFile && !previewUrl ? 'bg-gray-200 text-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'}`}
                            >
                                {editingMessageId ? 'Save' : 'Send'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default PaymentChat;