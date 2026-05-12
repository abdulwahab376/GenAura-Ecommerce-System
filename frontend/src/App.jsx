
import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import VoiceNav from './components/VoiceNav';
import { Toaster } from 'react-hot-toast';

function App() {
 

  return (
    <>
 <Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      background: '#fff',
      color: '#333',
      padding: '12px 20px',
      borderRadius: '8px',
      fontSize: '15px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      borderBottom: '3px solid #10b951', // Ye wo green line hai jo niche dikhegi
    },
    success: {
      iconTheme: {
        primary: '#10B981', // Green Tick Logo
        secondary: '#fff',
      },
    },
  }}
/>
<Toaster position="top-right" />
     <Navbar/>
     <Outlet/>
     <Footer/>
     <VoiceNav />
    </>
  )
}

export default App
