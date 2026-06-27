import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; 
import { toggleCart } from '../redux/features/cart/cartSlice'; 
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic } from 'lucide-react';

const VoiceNav = () => {
    const [isListening, setIsListening] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ✅ Get user from Redux state
    const { user } = useSelector((state) => state.auth); 

    // ✅ If user is Admin, don't show the Voice Search component
    if (user?.role === 'admin') {
        return null;
    }

    // 🔊 Machine Voice Function
    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1.0; 
        utterance.pitch = 1.0; 
        window.speechSynthesis.speak(utterance);
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return toast.error("Browser doesn't support Voice Recognition");

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        
        recognition.onstart = () => setIsListening(true);

        recognition.onresult = async (event) => {
            const transcript = event.results[0][0].transcript;
            setIsListening(false);
            const loadingToast = toast.loading(`AI Analyzing: "${transcript}"`);

            try {
                const res = await axios.post('http://localhost:5000/api/auth/voice-ai', { 
                    command: transcript 
                });
                
                let targetPath = res.data.path.trim(); 

                // Case Sensitivity Fix
                if (targetPath.includes('mainCategory=')) {
                    const parts = targetPath.split('mainCategory=');
                    targetPath = `${parts[0]}mainCategory=${parts[1].toLowerCase()}`;
                }

                // Clean-up
                const pathMatch = targetPath.match(/\/[^\s]*/);
                if (pathMatch) {
                    targetPath = pathMatch[0].replace(/[.]$|['"]/g, ""); 
                }

                toast.dismiss(loadingToast);

                // 🛒 Cart Logic with Voice
                if (targetPath === '/checkout' || targetPath.toLowerCase().includes('cart')) {
                    speak("Opening your shopping cart"); 
                    dispatch(toggleCart());
                    toast.success("Opening Cart", { icon: '🛒' });
                    return;
                }

                // 📍 Navigation Logic with Voice
                if (targetPath && targetPath.startsWith('/')) {
                    const finalPath = targetPath === '/home' ? '/' : targetPath;
                    
                    if (finalPath === '/') speak("Returning to home page.");
                    else if (finalPath.includes('mainCategory=men')) speak("Showing men's collection.");
                    else if (finalPath.includes('mainCategory=women')) speak("Showing women's collection.");
                    else if (finalPath.includes('mainCategory=kids')) speak("Showing kids collection.");
                    else if (finalPath === '/shop') speak("Opening all products.");
                    else if (finalPath === '/contact') speak("Opening contact page.");
                    else if (finalPath === '/dashboard') speak("Opening your dashboard.");
                    else if (finalPath === '/dashboard/orders') speak("Accessing your orders.");
                    else if (finalPath === '/dashboard/profile') speak("Opening your profile.");
                    else if (finalPath === '/dashboard/payment-support') speak("Opening payment support.");
                    else if (finalPath === '/dashboard/reviews') speak("Showing your reviews.");
                    else speak("Navigating now.");

                    navigate(finalPath);
                    toast.success(`Navigating to ${finalPath}`, { icon: '🚀' });
                } else {
                    speak(`Searching for ${transcript}`);
                    navigate(`/search?q=${transcript}`);
                }

            } catch (err) {
                toast.dismiss(loadingToast);
                speak("I encountered an error. Please try again.");
                console.error("❌ Error:", err.message);
            }
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
    };

    return (
        <div className="fixed bottom-10 right-10 z-[9999] flex items-center justify-center group">
            {/* 🌊 Pulsing Background Waves (Listening mode only) */}
            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.6, 2.2] }}
                        exit={{ opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute w-20 h-20 bg-red-500 rounded-full blur-2xl"
                    />
                )}
            </AnimatePresence>

            {/* 🔘 Main Voice Button */}
            <button
                onClick={startListening}
                className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 shadow-2xl overflow-hidden
                ${isListening 
                    ? 'bg-white text-red-600' 
                    : 'bg-black text-white hover:bg-red-600 hover:scale-110 active:scale-95'}`}
            >
                <AnimatePresence mode="wait">
                    {isListening ? (
                        /* 📊 Premium Voice Waveform Animation */
                        <motion.div 
                            key="waves"
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="flex gap-1 items-center h-full"
                        >
                            {[1, 2, 3, 4, 5].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [8, 26, 8] }}
                                    transition={{ 
                                        repeat: Infinity, 
                                        duration: 0.5, 
                                        delay: i * 0.1,
                                        ease: "easeInOut" 
                                    }}
                                    className="w-1 rounded-full bg-red-600" 
                                />
                            ))}
                        </motion.div>
                    ) : (
                        /* 🎤 Clear Mic Icon for Usability */
                        <motion.div
                            key="mic"
                            initial={{ opacity: 0, scale: 0.8 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <Mic size={28} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
            
            {/* 🏷️ Premium Red Tooltip on Hover */}
            {!isListening && (
               <span className="absolute -top-14 bg-red-600 text-white text-[10px] font-black tracking-widest px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl translate-y-2 group-hover:translate-y-0">
                   AI VOICE SEARCH
                   <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-600 rotate-45"></div>
               </span>
            )}
        </div>
    );
};

export default VoiceNav;