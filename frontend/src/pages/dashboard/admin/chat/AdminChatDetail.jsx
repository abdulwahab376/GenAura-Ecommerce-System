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
//   const channel = new BroadcastChannel('payment_sync');

//   const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem(storageKey) || '[]'));
//   const [status, setStatus] = useState(() => localStorage.getItem(statusKey) || 'Pending');
//   const [inputText, setInputText] = useState('');

//   useEffect(() => {
//     channel.postMessage({ action: 'chat_opened' });
//   }, []);

//   useEffect(() => {
//     channel.onmessage = (event) => {
//       if (event.data?.messages) {
//         setMessages(event.data.messages);
//         setStatus(event.data.status);
//         localStorage.setItem(storageKey, JSON.stringify(event.data.messages));
//         localStorage.setItem(statusKey, event.data.status);
//       }
//     };
//     return () => channel.close();
//   }, [storageKey, statusKey]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const syncToStorageAndBroadcast = (updatedMessages, newStatus = status) => {
//     localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
//     localStorage.setItem(statusKey, newStatus);
//     channel.postMessage({ messages: updatedMessages, status: newStatus });
//   };

//   const sendMessage = () => {
//     if (!inputText.trim()) return;
//     const newMsg = { id: Date.now(), sender: 'admin', text: inputText.trim() };
//     setMessages(prev => {
//       const updated = [...prev, newMsg];
//       syncToStorageAndBroadcast(updated);
//       return updated;
//     });
//     setInputText('');
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const handleAction = async (newStatus) => {
//     // Prevent updating to the same status
//     if (newStatus === status) return;

//     const text = newStatus === 'Approved'
//       ? '✅ Payment has been approved. Your order is now processing.'
//       : '❌ Payment has been rejected. Please contact support for more details.';

//     const newMsg = { id: Date.now(), sender: 'admin', text };
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
//   const displayOrderId = id ? `#${id.slice(-6)}` : 'Loading...';

//   return (
//     <div>
//       <div className="flex items-center gap-3 mb-6">
//         <button
//           onClick={() => navigate('/dashboard/chats')}
//           className="text-gray-500 hover:text-gray-800 transition-colors"
//         >
//           <ArrowLeft size={20} />
//         </button>
//         <h1 className="text-2xl font-extrabold uppercase tracking-tight text-gray-900">
//           Chat — {displayOrderId}
//         </h1>
//         <span className={`inline-block px-3 py-1 rounded-full text-white text-[11px] font-bold uppercase tracking-wide ${statusColor}`}>
//           {status}
//         </span>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-6">
//         <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col" style={{ maxHeight: '600px' }}>
//           <div className="flex-1 overflow-y-auto p-5 space-y-3">
//             {messages.map((msg) => (
//               <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
//                 <div className={`max-w-[75%] p-3 rounded-xl text-sm ${msg.sender === 'user'
//                     ? 'bg-gray-100 text-gray-700 border border-gray-200'
//                     : 'bg-[#5B4FD9] text-white'
//                   }`}>
//                   {msg.imageUrl && (
//                     <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
//                       <img src={msg.imageUrl} alt="Receipt" className="max-w-[220px] rounded-lg mb-2 border border-white/20 cursor-pointer hover:opacity-90" />
//                     </a>
//                   )}
//                   {msg.isFile && !msg.imageUrl && (
//                     <div className="flex items-center gap-2 mb-1 text-xs opacity-80">
//                       <span>📄</span>
//                       <span className="underline">{msg.text.replace('📎 Uploaded: ', '')}</span>
//                     </div>
//                   )}
//                   <p className="whitespace-pre-line">{msg.text}</p>
//                 </div>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>

//           <div className="border-t border-gray-200 p-4 flex gap-2">
//             <input
//               type="text"
//               value={inputText}
//               onChange={(e) => setInputText(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Type a message..."
//               className="border border-gray-200 p-3 rounded-lg w-full focus:outline-none focus:border-[#5B4FD9] bg-white text-sm text-gray-700 placeholder-gray-400"
//             />
//             <button
//               onClick={sendMessage}
//               className="bg-[#5B4FD9] hover:bg-[#4A3EC8] text-white py-3 px-5 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors flex-shrink-0"
//             >
//               Send
//             </button>
//           </div>
//         </div>

//         <div className="lg:w-[300px] flex-shrink-0">
//           <div className="bg-white rounded-xl border border-gray-200 p-5">
//             <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Payment Details</h3>
//             <div className="space-y-3 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-500">Order ID</span>
//                 <span className="font-semibold text-blue-600">{displayOrderId}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-500">Customer</span>
//                 <span className="font-medium text-gray-700 text-xs">{displayEmail}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-500">Amount</span>
//                 <span className="font-bold text-gray-900">Rs. {displayAmount}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-500">Status</span>
//                 <span className={`inline-block px-3 py-1 rounded-full text-white text-[11px] font-bold uppercase ${statusColor}`}>
//                   {status}
//                 </span>
//               </div>
//             </div>

//             {/* ✅ MODIFIED SECTION: Buttons stay visible but adapt to current status */}
//             <div className="mt-6 space-y-2 border-t pt-4">
//               <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Change Status:</p>
              
//               <button
//                 onClick={() => handleAction('Approved')}
//                 disabled={status === 'Approved'}
//                 className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors ${
//                   status === 'Approved' 
//                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
//                   : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
//                 }`}
//               >
//                 {status === 'Approved' ? 'Already Approved' : 'Approve Payment'}
//               </button>

//               <button
//                 onClick={() => handleAction('Rejected')}
//                 disabled={status === 'Rejected'}
//                 className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors ${
//                   status === 'Rejected' 
//                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
//                   : 'bg-red-500 hover:bg-red-600 text-white shadow-sm'
//                 }`}
//               >
//                 {status === 'Rejected' ? 'Already Rejected' : 'Reject Payment'}
//               </button>

//               {status !== 'Pending' && (
//                 <p className="text-[9px] text-center text-gray-400 mt-2 italic">
//                   * You can re-update the status anytime.
//                 </p>
//               )}
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
import { ArrowLeft } from 'lucide-react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../../../redux/features/orders/orderApi';

const AdminChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const { data: orders } = useGetAllOrdersQuery();
  const currentOrder = orders?.find(o => o._id === id);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const storageKey = `chat_${id}_messages`;
  const statusKey = `chat_${id}_status`;
  
  // ✅ Broadcast Channel for Real-time Sync
  const channel = new BroadcastChannel('payment_sync');

  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem(storageKey) || '[]'));
  const [status, setStatus] = useState(() => localStorage.getItem(statusKey) || 'Pending');
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    channel.postMessage({ action: 'chat_opened', orderId: id });
  }, [id]);

  useEffect(() => {
    channel.onmessage = (event) => {
      // Agar customer naya message bheje to storage se sync karo
      if (event.data?.orderId === id) {
        const updatedRaw = localStorage.getItem(storageKey);
        if (updatedRaw) {
          const parsed = JSON.parse(updatedRaw);
          setMessages(parsed);
        }
      }
    };
    return () => channel.close();
  }, [storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ Updated Sync Function
  const syncToStorageAndBroadcast = (updatedMessages, newStatus = status) => {
    localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
    localStorage.setItem(statusKey, newStatus);
    // Customer ko signal bhejna ke naya data aa gaya hai
    channel.postMessage({ orderId: id, messages: updatedMessages, status: newStatus });
  };

  // ✅ Updated Send Message (Fix for Customer Visibility)
  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMsg = { 
      id: Date.now(), 
      sender: 'admin', 
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Get latest from storage first to avoid overwriting
    const currentMsgs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updated = [...currentMsgs, newMsg];
    
    setMessages(updated);
    syncToStorageAndBroadcast(updated);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleAction = async (newStatus) => {
    if (newStatus === status) return;

    const text = newStatus === 'Approved'
      ? '✅ Payment has been approved. Your order is now processing.'
      : '❌ Payment has been rejected. Please contact support for more details.';

    const newMsg = { 
      id: Date.now(), 
      sender: 'admin', 
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const currentMsgs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedMsgs = [...currentMsgs, newMsg];

    setMessages(updatedMsgs);
    setStatus(newStatus);
    syncToStorageAndBroadcast(updatedMsgs, newStatus);

    try {
      await updateOrderStatus({ id: id, status: newStatus.toLowerCase() }).unwrap();
    } catch (err) {
      console.error("Failed to update status in database:", err);
    }
  };

  const statusColor = status === 'Approved' ? 'bg-green-600' : status === 'Rejected' ? 'bg-red-500' : 'bg-orange-500';

  const displayEmail = currentOrder?.email || 'Loading...';
  const displayAmount = currentOrder?.amount || currentOrder?.totalAmount || '0.00';
  const displayOrderId = id ? `#${id.slice(-6)}` : 'Loading...';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/dashboard/admin-chat-list')} // Apne path ke mutabiq check karein
          className="text-gray-500 hover:text-gray-800 transition-colors p-2 hover:bg-gray-200 rounded-full"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-gray-900">
          Chat — {displayOrderId}
        </h1>
        <span className={`inline-block px-3 py-1 rounded-full text-white text-[11px] font-bold uppercase tracking-wide ${statusColor}`}>
          {status}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col shadow-sm" style={{ height: '600px' }}>
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'user'
                    ? 'bg-white text-gray-700 border border-gray-200 rounded-tl-none'
                    : 'bg-[#5B4FD9] text-white rounded-tr-none'
                  }`}>
                  {msg.imageUrl && (
                    <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                      <img src={msg.imageUrl} alt="Receipt" className="max-w-[220px] rounded-lg mb-2 border border-white/20 cursor-pointer" />
                    </a>
                  )}
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  <span className={`text-[8px] block mt-1 opacity-60 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                    {msg.time || 'Sent'}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4 flex gap-2 bg-white rounded-b-xl">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#5B4FD9]/20 bg-gray-50 text-sm"
            />
            <button
              onClick={sendMessage}
              className="bg-[#5B4FD9] hover:bg-[#4A3EC8] text-white py-3 px-6 rounded-xl font-bold text-xs uppercase transition-all shadow-md active:scale-95"
            >
              Send
            </button>
          </div>
        </div>

        {/* Sidebar Details */}
        <div className="lg:w-[320px] flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-5">Order Information</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono font-bold text-indigo-600">{displayOrderId}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-500">Customer</span>
                <span className="font-medium text-gray-800 text-xs truncate max-w-[150px]">{displayEmail}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-500">Amount</span>
                <span className="font-black text-gray-900">Rs. {displayAmount}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Update Payment Status</p>
              
              <button
                onClick={() => handleAction('Approved')}
                disabled={status === 'Approved'}
                className={`w-full py-4 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all ${
                  status === 'Approved' 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200'
                }`}
              >
                Approve Payment
              </button>

              <button
                onClick={() => handleAction('Rejected')}
                disabled={status === 'Rejected'}
                className={`w-full py-4 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all ${
                  status === 'Rejected' 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200'
                }`}
              >
                Reject Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatDetail;