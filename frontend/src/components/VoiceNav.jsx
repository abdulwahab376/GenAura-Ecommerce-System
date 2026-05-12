import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleCart } from '../redux/features/cart/cartSlice'; 
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Mic, MicOff } from 'lucide-react';

const VoiceNav = () => {
    const [isListening, setIsListening] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return toast.error("Browser doesn't support Voice Recognition");

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
            setIsListening(true);
            console.log("🎤 Mic started: Listening...");
        };

        recognition.onresult = async (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("📝 Transcript captured:", transcript); // Check if mic heard you
            setIsListening(false);
            
            const loadingToast = toast.loading(`AI Analyzing: "${transcript}"`);

            try {
                console.log("🚀 Sending request to backend...");
                const res = await axios.post('http://localhost:5000/api/auth/voice-ai', { 
                    command: transcript 
                });
                
                console.log("✅ Backend raw response:", res.data);

                let targetPath = res.data.path.toLowerCase().trim();

                // Clean-up logic
                const pathMatch = targetPath.match(/\/[^\s]*/);
                if (pathMatch) {
                    targetPath = pathMatch[0].replace(/[.]$|['"]/g, ""); 
                }
                
                console.log("🎯 Final processed path:", targetPath);

                toast.dismiss(loadingToast);

                // Cart Logic
                if (targetPath === '/checkout' || targetPath.includes('cart')) {
                    console.log("🛒 Triggering Cart Drawer via Redux");
                    dispatch(toggleCart());
                    toast.success("Opening your shopping cart", { icon: '🛒' });
                    return;
                }

                // Navigation Logic
                if (targetPath && targetPath.startsWith('/')) {
                    console.log("📍 Navigating to:", targetPath);
                    navigate(targetPath);
                    toast.success(`Navigating to ${targetPath}`, { icon: '🚀' });
                } else {
                    console.log("🔍 Fallback: Searching for", transcript);
                    navigate(`/search?q=${transcript}`);
                    toast.success(`Searching for "${transcript}"`);
                }

            } catch (err) {
                toast.dismiss(loadingToast);
                toast.error("AI Assistant error. Check console.");
                console.error("❌ API Error Details:", err.response ? err.response.data : err.message);
            }
        };

        recognition.onerror = (event) => {
            console.error("❌ Speech Recognition Error:", event.error);
            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);
        recognition.start();
    };

    return (
        <div className="fixed bottom-8 right-8 z-[9999]">
            <button 
                onClick={startListening}
                className={`p-5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-all duration-500 flex items-center justify-center 
                ${isListening ? 'bg-red-600 scale-125 animate-pulse' : 'bg-black text-white hover:bg-red-600'}`}
            >
                {isListening ? (
                    <div className="flex gap-1 px-1">
                        <span className="w-1.5 h-4 bg-white animate-bounce"></span>
                        <span className="w-1.5 h-6 bg-white animate-bounce delay-75"></span>
                        <span className="w-1.5 h-4 bg-white animate-bounce delay-150"></span>
                    </div>
                ) : (
                    <Mic size={28} />
                )}
            </button>
            
            {!isListening && (
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap font-bold tracking-widest uppercase">
                    AI Voice Support
                </span>
            )}
        </div>
    );
};

export default VoiceNav;