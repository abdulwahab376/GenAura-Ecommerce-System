// /* eslint-disable react/no-unescaped-entities */
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useRegisterUserMutation } from "../redux/features/auth/authApi";

// const Register = () => {
//   const [username, setUserName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [password, setPassword] = useState("");
//   const [registerUser, { isLoading }] = useRegisterUserMutation();

//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     e.preventDefault();
//     const data = {
//       username,
//       email,
//       password,
//     };

//     console.log(data);
//     try {
//       await registerUser(data).unwrap();
//       alert("Registration successful");
//       navigate('/login');
//     } catch (err) {
//       alert("Registration failed");
//     }
//   };

//   return (
//     <section className='h-screen flex items-center justify-center'>
//       <div className="max-w-sm mx-auto bg-white border shadow p-8">
//         <h2 className="text-2xl font-semibold pt-5">Please Register</h2>
//         <form
//           onSubmit={handleRegister}
//           className="space-y-5 max-w-sm mx-auto pt-8"
//         >
//           <input
//             type="text"
//             value={username}
//             className="w-full bg-gray-100 focus:outline-none px-5 py-3"
//             onChange={(e) => setUserName(e.target.value)}
//             placeholder="Username"
//             required
//           />

//           <input
//             type="text"
//             value={email}
//             className="w-full bg-gray-100 focus:outline-none px-5 py-3"
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             required
//           />

//           <input
//             type="password"
//             value={password}
//             className="w-full bg-gray-100 focus:outline-none px-5 py-3"
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             required
//           />
//           {
//             message && <p className="text-red-500">{message}</p>
//           }
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full mt-5 bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-md"
//           >
//             Register
//           </button>
//         </form>

//         <p className="my-5 italic text-sm text-center">
//           Already have an account? Please 
//           <Link to="/login" className="text-red-700  px-1 underline">
//             Login
//           </Link>

//         </p>
//       </div>
//     </section>

//   );
// };

// export default Register;



/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../redux/features/auth/authApi";
import Footer from '../components/Footer'; 

const Register = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = { username, email, password };

    try {
      await registerUser(data).unwrap();
      navigate('/login');
    } catch (err) {
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <section className='min-h-screen flex flex-col relative font-sans bg-gray-100'>
      
      {/* Background Image Section */}
      <div 
        className='absolute inset-0 bg-cover bg-center bg-no-repeat z-0'
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')`,
          height: '100%' 
        }}
      >
        <div className='absolute inset-0 bg-black/50 backdrop-blur-[1px]'></div>
      </div>

      {/* Main Content Area */}
      <div className='flex-grow flex items-center justify-center px-4 z-10 py-6'>
        <div className='max-w-md w-full'>
          
          {/* Logo & Header */}
          <div className='text-center mb-6'>
            <Link to="/" className='inline-block transform hover:scale-105 transition-transform'>
               <div className='bg-white shadow-2xl rounded-2xl p-4 border border-white/20 mb-4'>
                  <h1 className='text-3xl font-black text-red-600 tracking-tighter'>
                    Lebaba<span className='text-rose-400'>.</span>
                  </h1>
               </div>
            </Link>
            <h2 className='text-2xl font-black text-white uppercase tracking-[0.3em] drop-shadow-lg'>Create Account</h2>
          </div>

          {/* Registration Card */}
          <div className='bg-white/95 backdrop-blur-md shadow-2xl rounded-[2.5rem] p-10 border border-white/50'>
            <form onSubmit={handleRegister} className='space-y-4'>
              
              {/* Username Input */}
              <div className='group'>
                <div className='relative'>
                  <i className="ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors"></i>
                  <input 
                    type="text" 
                    value={username}
                    className='w-full pl-12 pr-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-500 outline-none transition-all text-sm'
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Username"  /*  Label ki jagah yahan placeholder de diya */
                    required 
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className='group'>
                <div className='relative'>
                  <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors"></i>
                  <input 
                    type="email" 
                    value={email}
                    className='w-full pl-12 pr-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-500 outline-none transition-all text-sm'
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address" /*  Box ke andar mention kar diya */
                    required 
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className='group'>
                <div className='relative'>
                  <i className="ri-lock-2-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors"></i>
                  <input 
                    type="password" 
                    value={password}
                    className='w-full pl-12 pr-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-500 outline-none transition-all text-sm'
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" /*  Clean look */
                    required 
                  />
                </div>
              </div>

              {message && (
                <div className='bg-red-50 text-red-600 text-[11px] font-bold text-center py-2 rounded-lg'>
                  {message}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className='w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-xl shadow-red-900/20 transition-all active:scale-95 disabled:bg-gray-400 mt-2 flex items-center justify-center gap-2'
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className='uppercase tracking-[0.2em] text-xs'>Create Account</span>
                    <i className="ri-user-add-line"></i>
                  </>
                )}
              </button>
            </form>

            <div className='mt-3 text-center pt-6 border-t border-gray-100'>
              <p className='text-xs text-gray-400 font-semibold uppercase tracking-tighter'>
                Already have an account? 
                <Link to="/login" className='text-red-600 font-black hover:text-red-700 ml-1 underline decoration-2 underline-offset-4'>
                  Login Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Area - Solid White */}
      <div className='z-20 relative bg-white border-t border-gray-200'>
        <Footer />
      </div>

    </section>
  );
};

export default Register;