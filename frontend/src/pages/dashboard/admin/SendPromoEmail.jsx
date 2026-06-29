import React, { useState } from 'react';
import { useSendPromoEmailMutation } from '../../../redux/features/auth/authApi';
import { toast } from 'react-hot-toast';

const SendPromoEmail = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const [sendPromoEmail, { isLoading }] = useSendPromoEmailMutation();

    const handleSendBroadcast = async (e) => {
        e.preventDefault();
        
        if (!subject || !message) {
            toast.error("Please fill both Subject and Message!");
            return;
        }

        try {
            await sendPromoEmail({ subject, message }).unwrap();
            toast.success("Campaign Launched! Emails sent to all users.");
            setSubject('');
            setMessage('');
        } catch (err) {
            console.error("Error sending promo:", err);
            toast.error(err?.data?.message || "Failed to send broadcast emails.");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] py-10 px-4"> 
            <div className="max-w-4xl mx-auto">
                
                {/* Main Premium Card */}
                <div className="relative overflow-hidden bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
                    
                    {/* Top Decorative Gradient Bar */}
                    <div className="h-2 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>

                    <div className="p-8 md:p-12">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
                                        <i className="ri-megaphone-fill text-white text-xl"></i>
                                    </div>
                                    <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase">Marketing Engine</span>
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                                    Send <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Broadcast</span>
                                </h2>
                                <p className="text-slate-400 mt-3 font-medium max-w-xs text-sm">
                                    Reach your entire audience with a single click. High-delivery guaranteed.
                                </p>
                            </div>

                            {/* Stats Badge (Just for Style) */}
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-3xl flex gap-6">
                                <div className="text-center">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target</p>
                                    <p className="text-lg font-black text-slate-800">All Users</p>
                                </div>
                                <div className="w-[1px] h-10 bg-slate-200"></div>
                                <div className="text-center">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Channel</p>
                                    <p className="text-lg font-black text-slate-800">Email</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSendBroadcast} className="grid grid-cols-1 gap-8">
                            
                            {/* Subject Input */}
                            <div className="group">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[2px] text-slate-500 mb-3 ml-1 transition-colors group-focus-within:text-indigo-600">
                                    <i className="ri-edit-box-line"></i> Campaign Subject
                                </label>
                                <input 
                                    type="text" 
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g. Flash Sale: 50% Off Everything! 🔥"
                                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all duration-300 outline-none text-base font-semibold text-slate-800 placeholder:text-slate-300"
                                    required
                                />
                            </div>

                            {/* Message Textarea */}
                            <div className="group">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[2px] text-slate-500 mb-3 ml-1 transition-colors group-focus-within:text-indigo-600">
                                    <i className="ri-chat-1-line"></i> Email Content
                                </label>
                                <textarea 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Write your message here... Use emojis to make it catchy!"
                                    className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[30px] focus:border-indigo-500 focus:bg-white transition-all duration-300 outline-none h-60 text-base leading-relaxed text-slate-600 font-medium resize-none placeholder:text-slate-300"
                                    required
                                />
                            </div>

                            {/* Action Area */}
                            <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className={`relative overflow-hidden w-full md:w-2/3 py-5 rounded-2xl font-black uppercase tracking-[3px] text-sm transition-all duration-500 shadow-2xl 
                                    ${isLoading 
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.98]'}`}
                                >
                                    <div className="flex items-center justify-center gap-3 relative z-10">
                                        {isLoading ? (
                                            <>
                                                <div className="h-5 w-5 border-3 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ri-rocket-2-fill text-xl"></i>
                                                Launch Campaign
                                            </>
                                        )}
                                    </div>
                                </button>

                                <div className="flex items-center gap-3 w-full md:w-1/3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                    <i className="ri-error-warning-fill text-amber-500 text-xl"></i>
                                    <p className="text-[10px] text-amber-700 font-bold leading-tight uppercase">
                                        Action is irreversible. This will notify every customer.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Bottom Branding */}
                <div className="mt-12 text-center">
                    <p className="text-slate-300 font-black text-4xl uppercase tracking-[15px] opacity-20 select-none">
                        GENAURA ADMIN
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SendPromoEmail;