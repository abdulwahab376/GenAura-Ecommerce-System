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
        /* ✅ Fixed: Changed margin and padding to pull the form up */
        <div className="section__container !pt-0 !mt-2"> 
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-[30px] shadow-2xl shadow-slate-200 border border-slate-50">
                
                {/* Header Section */}
                <div className="text-center mb-6"> {/* ✅ Reduced margin-bottom */}
                    <div className="inline-block bg-red-50 text-red-600 p-3 rounded-2xl mb-3">
                        <i className="ri-megaphone-fill text-2xl"></i>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                        Marketing Broadcast
                    </h2>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[3px] mt-1">
                        Promote Your Latest Collection to Every User
                    </p>
                    <div className="w-16 h-1 bg-red-600 mx-auto mt-3"></div>
                </div>

                <form onSubmit={handleSendBroadcast} className="space-y-5"> {/* ✅ Reduced spacing */}
                    {/* Subject Input */}
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">
                            Campaign Subject
                        </label>
                        <input 
                            type="text" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. 50% OFF ON ALL JACKETS! 🔥"
                            className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-red-600 focus:bg-white transition-all duration-300 outline-none text-sm font-semibold text-gray-800"
                            required
                        />
                    </div>

                    {/* Message Textarea */}
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">
                            Email Message
                        </label>
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell your customers about the new arrivals, discounts, or updates..."
                            className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-3xl focus:border-red-600 focus:bg-white transition-all duration-300 outline-none h-48 text-sm leading-relaxed text-gray-600 font-medium resize-none"
                            required
                        />
                    </div>

                    {/* Info Box */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 flex items-start gap-3">
                        <i className="ri-information-line text-blue-500 text-lg"></i>
                        <p className="text-[11px] text-slate-500 leading-tight">
                            Note: Emails go to <strong>all registered users</strong> via BCC.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-[2px] text-xs transition-all duration-500 flex items-center justify-center gap-3 shadow-xl 
                        ${isLoading 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                            : 'bg-gray-900 text-white hover:bg-red-600 hover:shadow-red-200 active:scale-95'}`}
                    >
                        {isLoading ? (
                            <>
                                <div className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                Sending...
                            </>
                        ) : (
                            <>
                                <i className="ri-send-plane-fill text-lg"></i>
                                Blast Campaign Now
                            </>
                        )}
                    </button>
                </form>
            </div>
            
            {/* Design Decoration */}
            <div className="text-center mt-6 opacity-10">
                <h1 className="text-6xl font-black text-slate-100 uppercase select-none tracking-widest">
                    Lebaba Ads
                </h1>
            </div>
        </div>
    );
};

export default SendPromoEmail;