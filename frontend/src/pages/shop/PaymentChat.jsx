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

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const [messages, setMessages] = useState(() => {
        const saved = sessionStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : [
            { id: 1, sender: 'admin', text: `Hello! Please complete your payment of $${amount.toFixed(2)} using:\n• Easypaisa: 03XXXXXXXXX\n• Bank Transfer: XXXX-XXXX-XXXX-XXXX\n\nAfter sending, please upload your receipt here.` }
        ];
    });

    const [status, setStatus] = useState(() => sessionStorage.getItem(statusKey) || 'Pending');
    const [inputText, setInputText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    //  FIXED: Now listens for the actual data payload from the Admin tab
    useEffect(() => {
        channel.onmessage = (event) => {
            if (event.data?.messages) {
                setMessages(event.data.messages);
                setStatus(event.data.status);
                sessionStorage.setItem(storageKey, JSON.stringify(event.data.messages));
                sessionStorage.setItem(statusKey, event.data.status);
            }
        };
        return () => channel.close();
    }, [storageKey, statusKey]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!selectedFile) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const userMsg = {
                id: Date.now(),
                sender: 'user',
                text: inputText.trim() || "Sent a receipt",
                imageUrl: reader.result // Base64 image
            };

            const autoAdminMsg = {
                id: Date.now() + 1,
                sender: 'admin',
                text: "Receipt received! Your payment is under verification. Chat is disabled until admin review."
            };

            const updated = [...messages, userMsg, autoAdminMsg];
            setMessages(updated);
            sessionStorage.setItem(storageKey, JSON.stringify(updated));
            
            //  FIXED: Sending the actual data across the tabs
            channel.postMessage({ messages: updated, status: status });
            
            setSelectedFile(null);
            setInputText('');
        };
        reader.readAsDataURL(selectedFile);
    };

    const isLocked = status !== 'Pending' || messages.some(m => m.imageUrl);

    return (
        <section className="min-h-screen py-10 px-4 bg-white font-sans">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => navigate(-1)} className="text-sm font-semibold text-indigo-600">← Back</button>
                    {status === 'Approved' && (
                        <button onClick={() => navigate('/shop')} className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg animate-bounce">Buy More Stuff →</button>
                    )}
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-100">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-lg font-extrabold uppercase text-gray-900">Payment Chat</h2>
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">{status}</span>
                    </div>

                    <div className="h-96 overflow-y-auto mb-4 space-y-3 pr-1">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] p-3 rounded-xl text-sm ${msg.sender === 'admin' ? 'bg-white border text-gray-700' : 'bg-indigo-600 text-white'}`}>
                                    {msg.imageUrl && <img src={msg.imageUrl} alt="Receipt" className="max-w-[200px] rounded-lg mb-2" />}
                                    <p className="whitespace-pre-line">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 items-center">
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} disabled={isLocked} />
                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLocked} className={`p-3 rounded-lg border ${isLocked ? 'bg-gray-200 text-gray-400' : 'bg-white text-gray-500'}`}>📎</button>
                        <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} disabled={isLocked} placeholder={isLocked ? "Chat Locked - Awaiting Review" : "Type a message..."} className="w-full border p-3 rounded-lg text-sm outline-none" />
                        <button type="submit" disabled={isLocked || !selectedFile} className={`py-3 px-5 rounded-xl font-bold text-sm uppercase ${isLocked || !selectedFile ? 'bg-gray-300' : 'bg-indigo-600 text-white'}`}>Send</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default PaymentChat;