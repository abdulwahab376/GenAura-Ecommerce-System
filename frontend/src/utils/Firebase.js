import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  // Yahan 'import' small letters mein hoga aur lucide-react ki zaroorat nahi
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY, 
  authDomain: "lebabalogin.firebaseapp.com",
  projectId: "lebabalogin",
  storageBucket: "lebabalogin.firebasestorage.app",
  messagingSenderId: "596448423639",
  appId: "1:596448423639:web:00c88877fa057b5d900a92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exporting with the exact names you used in Login.jsx
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); // 'new' lagana zaroori hai