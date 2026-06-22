import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// ✅ useGoogleLoginMutation ko add kiya
import { useLoginUserMutation, useGoogleLoginMutation } from '../redux/features/auth/authApi';
import { setUser } from '../redux/features/auth/authSlice';
import { toast } from 'react-hot-toast';
import Footer from '../components/Footer';

// --- GOOGLE AUTH IMPORTS ---
import { auth, googleProvider } from "../utils/Firebase.js"; 
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // ✅ Eye button ki state add ki

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Hooks
  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();
  const [googleLogin] = useGoogleLoginMutation(); // ✅ Naya hook initialize kiya

  // 1. Email/Password Login (Purana Logic)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password }).unwrap();
      dispatch(setUser({ user: response.user }));
      toast.success(`Welcome back, ${response.user.username}!`);
      navigate('/');
    } catch (err) {
      setMessage("Invalid email or password!");
      toast.error("Login Failed");
    }
  };

  // 2. Google Login Function (Updated Logic)
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // ✅ Backend ke naye endpoint (/google-login) par request bhej rahe hain
      const response = await googleLogin({ 
        email: user.email, 
        username: user.displayName,
        profileImage: user.photoURL 
      }).unwrap();

      dispatch(setUser({ user: response.user }));
      toast.success(`Logged in as ${user.displayName}`);
      navigate('/');
    } catch (error) {
      console.error("Google Auth Error:", error);
      // Agar error COOP wala hai toh console mein details dikhayega
      toast.error("Google Sign-In Failed");
    }
  };

  return (
    <section className='min-h-screen flex flex-col relative font-sans bg-gray-100'>
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
                  GenAura<span className='text-rose-400'>.</span>
                </h1>
              </div>
            </Link>
            <h2 className='text-2xl font-black text-white uppercase tracking-[0.3em] drop-shadow-lg'>Login</h2>
          </div>

          <div className='bg-white/95 backdrop-blur-md shadow-2xl rounded-[2.5rem] p-10 border border-white/50'>
            <form onSubmit={handleLogin} className='space-y-5'>
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

              <div className='group'>
                <div className='relative'>
                  <i className="ri-lock-2-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors"></i>
                  <input
                    type={showPassword ? "text" : "password"} // ✅ State ke mutabiq type change hogi
                    value={password}
                    className='w-full pl-12 pr-12 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-500 outline-none transition-all text-sm'
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                  {/* ✅ Toggle Eye Button - Fixed Logic */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                  >
                    <i className={showPassword ? "ri-eye-line text-lg" : "ri-eye-off-line text-lg"}></i>
                  </button>
                </div>
                <div className='flex justify-end mt-1 px-1'>
                  <Link to="/forgot-password" className='text-[10px] text-gray-400 hover:text-red-600 uppercase tracking-widest font-bold transition-colors'>Forgot Password?</Link>
                </div>
              </div>

              {message && (
                <div className='bg-red-50 text-red-600 text-[11px] font-bold text-center py-2 rounded-lg animate-pulse'>
                  <i className="ri-error-warning-line mr-1"></i> {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className='w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-xl shadow-red-900/20 transition-all active:scale-95 disabled:bg-gray-400 mt-2 flex items-center justify-center gap-2'
              >
                {loginLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <><span className='uppercase tracking-[0.2em] text-xs'>Login</span><i className="ri-arrow-right-line"></i></>
                )}
              </button>
            </form>

            {/* --- GOOGLE LOGIN SECTION --- */}
            <div className="mt-6">
              <div className="relative flex items-center justify-center mb-6">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">Or continue with</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-3.5 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all active:scale-95"
              >
                <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="google" />
                <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Google Account</span>
              </button>
            </div>

            <div className='mt-8 text-center pt-6 border-t border-gray-100'>
              <p className='text-xs text-gray-400 font-semibold uppercase tracking-tighter'>
                Don't have an account?
                <Link to="/register" className='text-red-600 font-black hover:text-red-700 ml-1 underline decoration-2 underline-offset-4'>
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='z-20 relative bg-white border-t border-gray-200'>
        <Footer />
      </div>
    </section>
  );
};

export default Login;