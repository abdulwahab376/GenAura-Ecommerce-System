// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { toggleCart } from '../redux/features/cart/cartSlice'; 
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import { Mic } from 'lucide-react';

// const VoiceNav = () => {
//     const [isListening, setIsListening] = useState(false);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     // 🔊 Machine Voice Function
//     const speak = (text) => {
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.lang = 'en-US';
//         utterance.rate = 1.0; // Speed (1.0 is normal)
//         utterance.pitch = 1.0; 
//         window.speechSynthesis.speak(utterance);
//     };

//     const startListening = () => {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return toast.error("Browser doesn't support Voice Recognition");

//         const recognition = new SpeechRecognition();
//         recognition.lang = 'en-US';
        
//         recognition.onstart = () => setIsListening(true);

//         recognition.onresult = async (event) => {
//             const transcript = event.results[0][0].transcript;
//             setIsListening(false);
//             const loadingToast = toast.loading(`AI Analyzing: "${transcript}"`);

//             try {
//                 const res = await axios.post('http://localhost:5000/api/auth/voice-ai', { 
//                     command: transcript 
//                 });
                
//                 let targetPath = res.data.path.trim(); 

//                 // Case Sensitivity Fix
//                 if (targetPath.includes('mainCategory=')) {
//                     const parts = targetPath.split('mainCategory=');
//                     targetPath = `${parts[0]}mainCategory=${parts[1].toLowerCase()}`;
//                 }

//                 // Clean-up
//                 const pathMatch = targetPath.match(/\/[^\s]*/);
//                 if (pathMatch) {
//                     targetPath = pathMatch[0].replace(/[.]$|['"]/g, ""); 
//                 }

//                 toast.dismiss(loadingToast);

//                 // 🛒 Cart Logic with Voice
//                 if (targetPath === '/checkout' || targetPath.toLowerCase().includes('cart')) {
//                     speak("Opening your shopping cart"); // 🔊 Bolay ga
//                     dispatch(toggleCart());
//                     toast.success("Opening Cart", { icon: '🛒' });
//                     return;
//                 }

//                 // 📍 Navigation Logic with Voice (Matching your Backend Prompt)
// if (targetPath && targetPath.startsWith('/')) {
//     const finalPath = targetPath === '/home' ? '/' : targetPath;
    
//     // Voice Messages logic matching your user.route.js mapping
//     if (finalPath === '/') {
//         speak("Returning to home page.");
//     } 
//     else if (finalPath.includes('mainCategory=men')) {
//         speak("Showing men's collection.");
//     } 
//     else if (finalPath.includes('mainCategory=women')) {
//         speak("Showing women's collection.");
//     } 
//     else if (finalPath.includes('mainCategory=kids')) {
//         speak("Showing kids collection.");
//     } 
//     else if (finalPath === '/shop') {
//         speak("Opening all products.");
//     } 
//     else if (finalPath === '/contact') {
//         speak("Opening contact page.");
//     } 
//     else if (finalPath === '/dashboard') {
//         speak("Opening your dashboard.");
//     } 
//     else if (finalPath === '/dashboard/orders') {
//         speak("Accessing your orders.");
//     } 
//     else if (finalPath === '/dashboard/profile') {
//         speak("Opening your profile.");
//     } 
//     else if (finalPath === '/dashboard/payment-support') {
//         speak("Opening payment support.");
//     } 
//     else if (finalPath === '/dashboard/reviews') {
//         speak("Showing your reviews.");
//     } 
//     else {
//         speak("Navigating now.");
//     }

//     navigate(finalPath);
//     toast.success(`Navigating to ${finalPath}`, { icon: '🚀' });
// } else {
//                     speak(`Searching for ${transcript}`);
//                     navigate(`/search?q=${transcript}`);
//                 }

//             } catch (err) {
//                 toast.dismiss(loadingToast);
//                 speak("I encountered an error. Please try again.");
//                 console.error("❌ Error:", err.message);
//             }
//         };

//         recognition.onerror = () => setIsListening(false);
//         recognition.onend = () => setIsListening(false);
//         recognition.start();
//     };

//     return (
//         <div className="fixed bottom-8 right-8 z-[9999]">
//             <button 
//                 onClick={startListening}
//                 className={`p-5 rounded-full shadow-lg transition-all duration-500 
//                 ${isListening ? 'bg-red-600 scale-125 animate-pulse' : 'bg-black text-white hover:bg-red-600'}`}
//             >
//                 <Mic size={28} />
//             </button>
//         </div>
//     );
// };

// export default VoiceNav;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // ✅ Added useSelector
import { toggleCart } from '../redux/features/cart/cartSlice'; 
import axios from 'axios';
import { toast } from 'react-hot-toast';
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

                // 📍 Navigation Logic with Voice (Matching your Backend Prompt)
                if (targetPath && targetPath.startsWith('/')) {
                    const finalPath = targetPath === '/home' ? '/' : targetPath;
                    
                    // Voice Messages logic matching your user.route.js mapping
                    if (finalPath === '/') {
                        speak("Returning to home page.");
                    } 
                    else if (finalPath.includes('mainCategory=men')) {
                        speak("Showing men's collection.");
                    } 
                    else if (finalPath.includes('mainCategory=women')) {
                        speak("Showing women's collection.");
                    } 
                    else if (finalPath.includes('mainCategory=kids')) {
                        speak("Showing kids collection.");
                    } 
                    else if (finalPath === '/shop') {
                        speak("Opening all products.");
                    } 
                    else if (finalPath === '/contact') {
                        speak("Opening contact page.");
                    } 
                    else if (finalPath === '/dashboard') {
                        speak("Opening your dashboard.");
                    } 
                    else if (finalPath === '/dashboard/orders') {
                        speak("Accessing your orders.");
                    } 
                    else if (finalPath === '/dashboard/profile') {
                        speak("Opening your profile.");
                    } 
                    else if (finalPath === '/dashboard/payment-support') {
                        speak("Opening payment support.");
                    } 
                    else if (finalPath === '/dashboard/reviews') {
                        speak("Showing your reviews.");
                    } 
                    else {
                        speak("Navigating now.");
                    }

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
        <div className="fixed bottom-8 right-8 z-[9999]">
            <button 
                onClick={startListening}
                className={`p-5 rounded-full shadow-lg transition-all duration-500 
                ${isListening ? 'bg-red-600 scale-125 animate-pulse' : 'bg-black text-white hover:bg-red-600'}`}
            >
                <Mic size={28} />
            </button>
        </div>
    );
};

export default VoiceNav;