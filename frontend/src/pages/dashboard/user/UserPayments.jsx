import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CustomerPaymentChat = () => {
  const { id } = useParams(); // Get ID from URL to match Admin's chat_id
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  //  Standardized Key: Matches AdminChatDetail
  const storageKey = `chat_${id}_messages`;

  // Initial Load Logic
  const loadMessages = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return [
      { id: 1, sender: 'admin', text: 'Hello! Please upload your receipt here to complete your payment.' }
    ];
  };

  const [messages, setMessages] = useState(loadMessages());
  const [inputText, setInputText] = useState('');

  //  POLLING: Listen for Admin's replies every second
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (JSON.stringify(stored) !== JSON.stringify(messages)) {
          setMessages(stored);
        }
      } catch { /* ignore */ }
    }, 1000);
    return () => clearInterval(interval);
  }, [messages, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveAndSend = (updatedMessages) => {
    setMessages(updatedMessages);
    localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = { id: Date.now(), sender: 'user', text: inputText.trim() };
    saveAndSend([...messages, newMsg]);
    setInputText('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newMsg = { 
        id: Date.now(), 
        sender: 'user', 
        text: `📎 Uploaded: ${file.name}`, 
        isFile: true, 
        imageUrl: file.type.startsWith('image/') ? reader.result : null 
      };
      saveAndSend([...messages, newMsg]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold text-gray-900">Payment Support</h2>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-xl text-sm ${
                msg.sender === 'admin' ? 'bg-gray-100 text-gray-700 border border-gray-200' : 'bg-[#5B4FD9] text-white'
              }`}>
                {msg.imageUrl && <img src={msg.imageUrl} alt="Receipt" className="max-w-full rounded-lg mb-2" />}
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t border-gray-200 p-4 flex gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,.pdf" />
          <button onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100">📎</button>
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="border p-3 rounded-lg w-full text-sm outline-none focus:border-[#5B4FD9]" />
          <button onClick={sendMessage} className="bg-[#5B4FD9] text-white px-5 py-3 rounded-lg font-bold text-xs uppercase">Send</button>
        </div>
      </div>
    </div>
  );
};
export default CustomerPaymentChat;