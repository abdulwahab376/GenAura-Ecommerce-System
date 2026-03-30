// import React, { useState, useRef, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';
// import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../../../redux/features/orders/orderApi';

// const AdminChatDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const messagesEndRef = useRef(null);

//   const { data: orders } = useGetAllOrdersQuery();
//   const currentOrder = orders?.find(o => o._id === id);
//   const [updateOrderStatus] = useUpdateOrderStatusMutation();

//   const storageKey = `chat_${id}_messages`;
//   const statusKey = `chat_${id}_status`;

//   const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem(storageKey) || '[]'));
//   const [status, setStatus] = useState(() => localStorage.getItem(statusKey) || 'Pending');
//   const [inputText, setInputText] = useState('');

//   // Notify system Admin is viewing
//   useEffect(() => {
//     localStorage.setItem(`chat_read_${id}`, 'true');
//     const channel = new BroadcastChannel('payment_sync');
//     channel.postMessage({ action: 'chat_opened', orderId: id });
//     channel.close();
//   }, [id]);

//   // Live Sync Listener
//   useEffect(() => {
//     const channel = new BroadcastChannel('payment_sync');
//     channel.onmessage = (event) => {
//       if (event.data?.orderId === id && event.data?.messages) {
//         setMessages(event.data.messages);
//         if(event.data.status) setStatus(event.data.status);
//         localStorage.setItem(`chat_read_${id}`, 'true'); // Admin is still here
//       }
//     };
//     return () => channel.close();
//   }, [id, storageKey]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const syncToStorageAndBroadcast = (updatedMessages, newStatus = status) => {
//     localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
//     localStorage.setItem(statusKey, newStatus);
    
//     // Notify Customer they have an unread message
//     localStorage.setItem(`customer_read_${id}`, 'false');
    
//     const channel = new BroadcastChannel('payment_sync');
//     channel.postMessage({ orderId: id, messages: updatedMessages, status: newStatus });
//     channel.close();
//   };

//   const sendMessage = () => {
//     if (!inputText.trim()) return;
//     const newMsg = { id: Date.now(), sender: 'admin', text: inputText.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    
//     const updated = [...messages, newMsg];
//     setMessages(updated);
//     syncToStorageAndBroadcast(updated);
//     setInputText('');
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
//   };

//   const handleAction = async (newStatus) => {
//     if (newStatus === status) return;
//     const text = newStatus === 'Approved' ? '✅ Payment has been approved. Your order is now processing.' : '❌ Payment has been rejected. Please contact support for more details.';
    
//     const newMsg = { id: Date.now(), sender: 'admin', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
//     const updatedMsgs = [...messages, newMsg];

//     setMessages(updatedMsgs);
//     setStatus(newStatus);
//     syncToStorageAndBroadcast(updatedMsgs, newStatus);

//     try {
//       await updateOrderStatus({ id: id, status: newStatus.toLowerCase() }).unwrap();
//     } catch (err) {
//       console.error("Failed to update status in database:", err);
//     }
//   };

//   const statusColor = status === 'Approved' ? 'bg-green-600' : status === 'Rejected' ? 'bg-red-500' : 'bg-orange-500';
//   const displayEmail = currentOrder?.email || 'Loading...';
//   const displayAmount = currentOrder?.amount || currentOrder?.totalAmount || '0.00';

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="flex items-center gap-3 mb-6">
//         <button onClick={() => navigate('/dashboard/chats')} className="text-gray-500 hover:text-gray-800 transition-colors p-2 hover:bg-gray-200 rounded-full"><ArrowLeft size={20} /></button>
//         <h1 className="text-2xl font-extrabold uppercase tracking-tight text-gray-900">Chat — #{id.slice(-6)}</h1>
//         <span className={`inline-block px-3 py-1 rounded-full text-white text-[11px] font-bold uppercase tracking-wide ${statusColor}`}>{status}</span>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-6">
//         <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col shadow-sm" style={{ height: '600px' }}>
//           <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
//             {messages.map((msg) => (
//               <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
//                 <div className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-white text-gray-700 border border-gray-200 rounded-tl-none' : 'bg-[#5B4FD9] text-white rounded-tr-none'}`}>
//                   {msg.imageUrl && <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer"><img src={msg.imageUrl} alt="Receipt" className="max-w-[220px] rounded-lg mb-2 border border-white/20 cursor-pointer" /></a>}
//                   <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
//                   <span className={`text-[8px] block mt-1 opacity-60 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>{msg.time || 'Sent'}</span>
//                 </div>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>

//           <div className="border-t border-gray-200 p-4 flex gap-2 bg-white rounded-b-xl">
//             <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type a message..." className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#5B4FD9]/20 bg-gray-50 text-sm" />
//             <button onClick={sendMessage} className="bg-[#5B4FD9] hover:bg-[#4A3EC8] text-white py-3 px-6 rounded-xl font-bold text-xs uppercase transition-all shadow-md active:scale-95">Send</button>
//           </div>
//         </div>

//         <div className="lg:w-[320px] flex-shrink-0">
//           <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//             <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-5">Order Information</h3>
//             <div className="space-y-4 text-sm">
//               <div className="flex justify-between items-center border-b pb-2"><span className="text-gray-500">Order ID</span><span className="font-mono font-bold text-indigo-600">#{id.slice(-6)}</span></div>
//               <div className="flex justify-between items-center border-b pb-2"><span className="text-gray-500">Customer</span><span className="font-medium text-gray-800 text-xs truncate max-w-[150px]">{displayEmail}</span></div>
//               <div className="flex justify-between items-center border-b pb-2"><span className="text-gray-500">Amount</span><span className="font-black text-gray-900">Rs. {Number(displayAmount).toLocaleString()}</span></div>
//             </div>

//             <div className="mt-8 space-y-3">
//               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Update Payment Status</p>
//               <button onClick={() => handleAction('Approved')} disabled={status === 'Approved'} className={`w-full py-4 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all ${status === 'Approved' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200'}`}>Approve Payment</button>
//               <button onClick={() => handleAction('Rejected')} disabled={status === 'Rejected'} className={`w-full py-4 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all ${status === 'Rejected' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200'}`}>Reject Payment</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminChatDetail;




import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, X } from 'lucide-react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../../../redux/features/orders/orderApi';
import { 
  useGetChatByIdQuery, 
  useSendMessageMutation, 
  useUpdateChatStatusMutation,
  useDeleteMessageMutation,
  useUpdateMessageMutation 
} from '../../../../redux/features/chats/chatsApi';

const AdminChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 🚀 References for Smart Scroll
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { data: dbChat, isLoading: isChatLoading } = useGetChatByIdQuery(id, {
    pollingInterval: 3000 
  });
  
  const [sendToDb] = useSendMessageMutation();
  const [updateDbStatus] = useUpdateChatStatusMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [updateMessage] = useUpdateMessageMutation();

  const { data: orders } = useGetAllOrdersQuery();
  const currentOrder = orders?.find(o => o._id === id);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const [inputText, setInputText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState(null);

  const initialAdminMessage = { 
    _id: 'instruction-msg-static', 
    sender: 'admin', 
    text: `Hello ${currentOrder?.email?.split('@')[0] || 'Customer'}! Please complete your payment using:\n\n• Easypaisa: 03XXXXXXXXX\n• JazzCash: 03XXXXXXXXX\n• Bank Transfer: XXXX-XXXX-XXXX-XXXX\n\nAccount Title: Abdul Wahab\n\nAfter sending, please upload your receipt here.`, 
    createdAt: currentOrder?.createdAt || new Date().toISOString()
  };

  const messages = dbChat?.messages 
    ? [initialAdminMessage, ...dbChat.messages] 
    : [initialAdminMessage];

  const status = dbChat?.status || 'Pending';

  // 🚀 SMART SCROLL LOGIC
  const scrollToBottom = (force = false) => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = chatContainerRef.current;
      
      // Check if user is near bottom (150px threshold)
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 150;

      if (force || isAtBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Auto-scroll when messages change (polling)
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial scroll when chat opens
  useEffect(() => {
    const timer = setTimeout(() => scrollToBottom(true), 100);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`chat_read_${id}`, 'true');
    const channel = new BroadcastChannel('payment_sync');
    channel.postMessage({ action: 'chat_opened', orderId: id });
    return () => channel.close();
  }, [id]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    try {
      if (editingMessageId) {
        await updateMessage({ 
          orderId: id, 
          messageId: editingMessageId, 
          message: { text: inputText.trim(), sender: 'admin', updatedAt: new Date() } 
        }).unwrap();
        setEditingMessageId(null);
      } else {
        const newMessageObj = { 
          sender: 'admin', 
          text: inputText.trim(), 
          createdAt: new Date() 
        };
        await sendToDb({ id, message: newMessageObj }).unwrap();
        
        // Force scroll because admin sent a message
        setTimeout(() => scrollToBottom(true), 100);
      }

      const channel = new BroadcastChannel('payment_sync');
      channel.postMessage({ orderId: id, action: 'new_message' });
      channel.close();
      setInputText('');
    } catch (err) {
      console.error("Operation Error:", err);
    }
  };

  const handleEdit = (msg) => {
    setEditingMessageId(msg._id);
    setInputText(msg.text);
  };

  const handleDelete = async (msgId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteMessage({ orderId: id, messageId: msgId }).unwrap();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleAction = async (newStatus) => {
    if (newStatus === status) return;
    const text = newStatus === 'Approved' ? '✅ Payment has been approved. Your order is now processing.' : '❌ Payment has been rejected. Please contact support for more details.';
    
    const adminMsg = { 
      sender: 'admin', 
      text, 
      createdAt: new Date()
    };
    
    try {
      await updateDbStatus({ id, status: newStatus, adminMessage: adminMsg }).unwrap();
      await updateOrderStatus({ id: id, status: newStatus.toLowerCase() }).unwrap();
      
      const channel = new BroadcastChannel('payment_sync');
      channel.postMessage({ orderId: id, status: newStatus });
      channel.close();
      
      // Status update pe bhi auto-scroll to bottom
      setTimeout(() => scrollToBottom(true), 200);
    } catch (err) {
      console.error("Database Update Error:", err);
    }
  };

  const statusColor = status === 'Approved' ? 'bg-green-600' : status === 'Rejected' ? 'bg-red-500' : 'bg-orange-500';
  const displayEmail = currentOrder?.email || 'Loading...';
  const displayAmount = currentOrder?.amount || currentOrder?.totalAmount || '0.00';

  if (isChatLoading) return <div className="h-screen flex items-center justify-center font-bold text-indigo-600">Loading Database...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/dashboard/chats')} className="text-gray-500 hover:text-gray-800 transition-colors p-2 hover:bg-gray-200 rounded-full"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-gray-900">Chat — #{id.slice(-6)}</h1>
        <span className={`inline-block px-3 py-1 rounded-full text-white text-[11px] font-bold uppercase tracking-wide ${statusColor}`}>{status}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col shadow-sm" style={{ height: '600px' }}>
          
          {/* 🚀 Ref attached to container for scroll checking */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
            {messages.map((msg, index) => (
              <div key={msg._id || index} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'} group`}>
                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-white text-gray-700 border border-gray-200 rounded-tl-none' : 'bg-[#5B4FD9] text-white rounded-tr-none'}`}>
                    {msg.imageUrl && (
                      <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                        <img src={msg.imageUrl} alt="Receipt" className="max-w-[220px] rounded-lg mb-2 border border-white/20 cursor-pointer" />
                      </a>
                    )}
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  </div>
                  
                  {msg.sender === 'admin' && msg._id !== 'instruction-msg-static' && (
                    <div className="flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(msg)} className="text-[10px] text-gray-400 hover:text-indigo-600 flex items-center gap-0.5"><Edit2 size={10}/> Edit</button>
                      <button onClick={() => handleDelete(msg._id)} className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-0.5"><Trash2 size={10}/> Delete</button>
                    </div>
                  )}

                  <span className={`text-[8px] block mt-1 opacity-60 px-2 uppercase ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Sent'}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4 flex flex-col gap-2 bg-white rounded-b-xl">
            {editingMessageId && (
              <div className="flex justify-between items-center bg-amber-50 px-3 py-1 rounded-lg border border-amber-100 mb-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase">Editing Mode</span>
                <button onClick={() => {setEditingMessageId(null); setInputText('');}} className="text-amber-700"><X size={12}/></button>
              </div>
            )}
            <div className="flex gap-2">
              <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyDown} placeholder={editingMessageId ? "Update your message..." : "Type a message..."} className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#5B4FD9]/20 bg-gray-50 text-sm" />
              <button onClick={sendMessage} className={`${editingMessageId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#5B4FD9] hover:bg-[#4A3EC8]'} text-white py-3 px-6 rounded-xl font-bold text-xs uppercase transition-all shadow-md active:scale-95`}>
                {editingMessageId ? 'Update' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:w-[320px] flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-5">Order Information</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center border-b pb-2"><span className="text-gray-500">Order ID</span><span className="font-mono font-bold text-indigo-600">#{id.slice(-6)}</span></div>
              <div className="flex justify-between items-center border-b pb-2"><span className="text-gray-500">Customer</span><span className="font-medium text-gray-800 text-xs truncate max-w-[150px]">{displayEmail}</span></div>
              <div className="flex justify-between items-center border-b pb-2"><span className="text-gray-500">Amount</span><span className="font-black text-gray-900">Rs. {Number(displayAmount).toLocaleString()}</span></div>
            </div>

            <div className="mt-8 space-y-3">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Update Payment Status</p>
              <button onClick={() => handleAction('Approved')} disabled={status === 'Approved'} className={`w-full py-4 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all ${status === 'Approved' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200'}`}>Approve Payment</button>
              <button onClick={() => handleAction('Rejected')} disabled={status === 'Rejected'} className={`w-full py-4 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all ${status === 'Rejected' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200'}`}>Reject Payment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatDetail;