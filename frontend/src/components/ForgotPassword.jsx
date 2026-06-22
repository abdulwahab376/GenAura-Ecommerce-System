import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../utils/Firebase.js'; // Ensure this path matches your Firebase config file
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🚀 Firebase Auth logic jo user ko password reset email bhejega
      await sendPasswordResetEmail(auth, email);
      
      toast.success("Password reset email sent! Check your inbox.");
      setEmail(''); // Clear input after success
    } catch (error) {
      console.error("Reset Password Error:", error);
      
      // Error handling according to Firebase error codes
      if (error.code === 'auth/user-not-found') {
        toast.error("This email is not registered!");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Invalid email format!");
      } else {
        toast.error("Something went wrong. Try again!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='min-h-screen flex flex-col relative font-sans bg-gray-100'>
      {/* Background Image Overlay (Same as Login Page) */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat z-0'
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')`,
          height: '100%'
        }}
      >
        <div className='absolute inset-0 bg-black/50 backdrop-blur-[1px]'></div>
      </div>

      <div className='flex-grow flex items-center justify-center px-4 z-10 py-10'>
        <div className='max-w-md w-full'>
          <div className='text-center mb-6'>
            <Link to="/" className='inline-block transform hover:scale-105 transition-transform'>
              <div className='bg-white shadow-2xl rounded-2xl p-4 border border-white/20 mb-4'>
                <h1 className='text-3xl font-black text-red-600 tracking-tighter'>
                  Lebaba<span className='text-rose-400'>.</span>
                </h1>
              </div>
            </Link>
            <h2 className='text-2xl font-black text-white uppercase tracking-[0.2em] drop-shadow-lg text-sm'>Reset Password</h2>
          </div>

          <div className='bg-white/95 backdrop-blur-md shadow-2xl rounded-[2.5rem] p-10 border border-white/50'>
            <p className='text-xs text-gray-500 font-semibold text-center mb-6 uppercase tracking-wider leading-relaxed'>
              Enter your registered email. Firebase will send a secure password reset link to your inbox.
            </p>

            <form onSubmit={handleResetPassword} className='space-y-5'>
              <div className='group'>
                <div className='relative'>
                  <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors"></i>
                  <input
                    type="email"
                    value={email}
                    className='w-full pl-12 pr-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-500 outline-none transition-all text-sm'
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className='w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-xl shadow-red-900/20 transition-all active:scale-95 disabled:bg-gray-400 mt-2 flex items-center justify-center gap-2'
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <><span className='uppercase tracking-[0.2em] text-xs'>Send Reset Link</span><i className="ri-arrow-right-line"></i></>
                )}
              </button>
            </form>

            <div className='mt-6 text-center pt-4 border-t border-gray-100'>
              <p className='text-xs text-gray-400 font-semibold uppercase tracking-tighter'>
                Remember your password?
                <Link to="/login" className='text-red-600 font-black hover:text-red-700 ml-1 underline decoration-2 underline-offset-4'>
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;