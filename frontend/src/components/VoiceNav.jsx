// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { toggleCart } from '../redux/features/cart/cartSlice'; 
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import { Mic, MicOff } from 'lucide-react';

// const VoiceNav = () => {
//     const [isListening, setIsListening] = useState(false);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const startListening = () => {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return toast.error("Browser doesn't support Voice Recognition");

//         const recognition = new SpeechRecognition();
//         recognition.lang = 'en-US';
        
//         recognition.onstart = () => {
//             setIsListening(true);
//             console.log("🎤 Mic started: Listening...");
//         };

//         recognition.onresult = async (event) => {
//             const transcript = event.results[0][0].transcript;
//             console.log("📝 Transcript captured:", transcript);
//             setIsListening(false);
            
//             const loadingToast = toast.loading(`AI Analyzing: "${transcript}"`);

//             try {
//                 console.log("🚀 Sending request to backend...");
//                 const res = await axios.post('http://localhost:5000/api/auth/voice-ai', { 
//                     command: transcript 
//                 });
                
//                 console.log("✅ Backend raw response:", res.data);

//                 let targetPath = res.data.path.trim(); 

//                 // ✅ CASE SENSITIVITY FIX: 
//                 // Agar path mein 'mainCategory=' hai, toh uske baad wali value ko lowercase kar do
//                 if (targetPath.includes('mainCategory=')) {
//                     const parts = targetPath.split('mainCategory=');
//                     // parts[0] is "/shop?" and parts[1] is "Women" or "Men"
//                     targetPath = `${parts[0]}mainCategory=${parts[1].toLowerCase()}`;
//                 }

//                 // Clean-up logic (Remove dots or quotes)
//                 const pathMatch = targetPath.match(/\/[^\s]*/);
//                 if (pathMatch) {
//                     targetPath = pathMatch[0].replace(/[.]$|['"]/g, ""); 
//                 }
                
//                 console.log("🎯 Final processed path:", targetPath);

//                 toast.dismiss(loadingToast);

//                 // Cart Logic
//                 if (targetPath === '/checkout' || targetPath.toLowerCase().includes('cart')) {
//                     dispatch(toggleCart());
//                     toast.success("Opening your shopping cart", { icon: '🛒' });
//                     return;
//                 }

//                 // Navigation Logic
//                 if (targetPath && targetPath.startsWith('/')) {
//                     const finalPath = targetPath === '/home' ? '/' : targetPath;
//                     console.log("📍 Navigating to:", finalPath);
//                     navigate(finalPath);
//                     toast.success(`Navigating to ${finalPath}`, { icon: '🚀' });
//                 } else {
//                     navigate(`/search?q=${transcript}`);
//                     toast.success(`Searching for "${transcript}"`);
//                 }

//             } catch (err) {
//                 toast.dismiss(loadingToast);
//                 toast.error("AI Assistant error.");
//                 console.error("❌ API Error Details:", err.response ? err.response.data : err.message);
//             }
//         };

//         recognition.onerror = (event) => {
//             setIsListening(false);
//         };

//         recognition.onend = () => setIsListening(false);
//         recognition.start();
//     };

//     return (
//         <div className="fixed bottom-8 right-8 z-[9999]">
//             <button 
//                 onClick={startListening}
//                 className={`p-5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-all duration-500 flex items-center justify-center 
//                 ${isListening ? 'bg-red-600 scale-125 animate-pulse' : 'bg-black text-white hover:bg-red-600'}`}
//             >
//                 {isListening ? (
//                     <div className="flex gap-1 px-1">
//                         <span className="w-1.5 h-4 bg-white animate-bounce"></span>
//                         <span className="w-1.5 h-6 bg-white animate-bounce delay-75"></span>
//                         <span className="w-1.5 h-4 bg-white animate-bounce delay-150"></span>
//                     </div>
//                 ) : (
//                     <Mic size={28} />
//                 )}
//             </button>
//         </div>
//     );
// };

// export default VoiceNav;






import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleCart } from '../redux/features/cart/cartSlice'; 
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Mic } from 'lucide-react';

const VoiceNav = () => {
    const [isListening, setIsListening] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 🔊 Machine Voice Function
    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1.0; // Speed (1.0 is normal)
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
                    speak("Opening your shopping cart"); // 🔊 Bolay ga
                    dispatch(toggleCart());
                    toast.success("Opening Cart", { icon: '🛒' });
                    return;
                }

                // 📍 Navigation Logic with Voice
                if (targetPath && targetPath.startsWith('/')) {
                    const finalPath = targetPath === '/home' ? '/' : targetPath;
                    
                    // Voice Messages logic
                    if (finalPath.includes('men')) speak("Showing our Mens collection");
                    else if (finalPath.includes('women')) speak("Showing our Women's Collection");
                    else if (finalPath.includes('kids')) speak("Showing our Kids Collection");
                    else if (finalPath.includes('orders')) speak("Fetching your orders");
                    else if (finalPath === '/') speak("Going back to home");
                    else speak("Navigating to requested page");

                    navigate(finalPath);
                    toast.success(`Navigating...`, { icon: '🚀' });
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