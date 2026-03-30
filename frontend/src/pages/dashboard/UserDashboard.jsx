// import React from 'react';
// import { useLogoutUserMutation } from '../../redux/features/auth/authApi';
// import { useDispatch } from 'react-redux';
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { logout } from '../../redux/features/auth/authSlice';
// import { toast } from 'react-hot-toast';

// const UserDashboard = () => {
//     const [logoutUser] = useLogoutUserMutation();
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const handleLogout = async () => {
//         try {
//             await logoutUser().unwrap();
//             dispatch(logout());
//             localStorage.removeItem('token');
//             localStorage.removeItem('user');
//             toast.success("User Logged out!", {
//                 style: { background: '#ef4444', color: '#fff' },
//                 icon: '👋'
//             });
//             navigate("/");
//         } catch (err) {
//             dispatch(logout());
//             navigate("/login");
//         }
//     };

//     const userNavItems = [
//         { path: '/dashboard', label: 'Dashboard', icon: 'ri-layout-line' },
//         { path: '/dashboard/orders', label: 'My Orders', icon: 'ri-shopping-bag-line' },
//         { path: '/dashboard/payments', label: 'Payments', icon: 'ri-bank-card-line' },
//         { path: '/dashboard/profile', label: 'Profile Settings', icon: 'ri-user-settings-line' },
//         { path: '/dashboard/reviews', label: 'My Reviews', icon: 'ri-star-line' },
//     ];

//     return (
//         <div className="space-y-5 bg-white p-6 md:h-screen flex flex-col justify-between shadow-lg border-r border-gray-100">
//             <div>
//                 <div className="nav__logo px-2">
//                     <Link to="/" className="text-2xl font-bold text-primary">Lebaba<span>.</span></Link>
//                     <p className='text-xs italic text-gray-400'>Customer Portal</p>
//                 </div>
//                 <hr className='mt-5 mb-5 border-gray-100'/>
                
//                 <ul className="space-y-2">
//                     {userNavItems.map((item) => (
//                         <li key={item.path}>
//                             <NavLink
//                                 to={item.path}
//                                 end
//                                 className={({ isActive }) =>
//                                     `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
//                                         isActive 
//                                         ? "bg-primary text-white shadow-md scale-105" 
//                                         : "text-gray-600 hover:bg-indigo-50 hover:text-primary"
//                                     }`
//                                 }
//                             >
//                                 <i className={`${item.icon} text-xl`}></i>
//                                 <span>{item.label}</span>
//                             </NavLink>
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             <div className="mt-auto">
//                 <hr className="mb-4 border-gray-100"/>
//                 <button 
//                     onClick={handleLogout}
//                     className="w-full flex items-center justify-center gap-2 text-white bg-red-500 font-bold px-5 py-3 rounded-xl hover:bg-red-600 transition-all shadow-md active:scale-95"
//                 >
//                     <i className="ri-logout-box-r-line"></i>
//                     Logout
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default UserDashboard;




import React from 'react';
import { useLogoutUserMutation } from '../../redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/features/auth/authSlice';
import { toast } from 'react-hot-toast';

const UserDashboard = () => {
    const [logoutUser] = useLogoutUserMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logout());
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            toast.success("User Logged out!", {
                style: { background: '#ef4444', color: '#fff' },
                icon: '👋'
            });
            navigate("/");
        } catch (err) {
            dispatch(logout());
            navigate("/login");
        }
    };

   const userNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'ri-layout-line' },
    { path: '/dashboard/orders', label: 'My Orders', icon: 'ri-shopping-bag-line' },
    { path: '/dashboard/payments', label: 'Payments', icon: 'ri-bank-card-line' },
    
    // ❌ Ghalat path: { path: '/dashboard/chats', label: 'Payment Support', ... }
    // ✅ Sahi path jo humne naya banaya hai:
    { path: '/dashboard/payment-support', label: 'Payment Support', icon: 'ri-chat-smile-3-line' },
    
    { path: '/dashboard/profile', label: 'Profile Settings', icon: 'ri-user-settings-line' },
    { path: '/dashboard/reviews', label: 'My Reviews', icon: 'ri-star-line' },
];

    return (
        <div className="space-y-5 bg-white p-6 md:h-screen flex flex-col justify-between shadow-lg border-r border-gray-100">
            <div>
                <div className="nav__logo px-2">
                    <Link to="/" className="text-2xl font-bold text-primary">Lebaba<span>.</span></Link>
                    <p className='text-xs italic text-gray-400'>Customer Portal</p>
                </div>
                <hr className='mt-5 mb-5 border-gray-100'/>
                
                <ul className="space-y-2">
                    {userNavItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                                        isActive 
                                        ? "bg-primary text-white shadow-md scale-105" 
                                        : "text-gray-600 hover:bg-indigo-50 hover:text-primary"
                                    }`
                                }
                            >
                                <i className={`${item.icon} text-xl`}></i>
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-auto">
                <hr className="mb-4 border-gray-100"/>
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 text-white bg-red-500 font-bold px-5 py-3 rounded-xl hover:bg-red-600 transition-all shadow-md active:scale-95"
                >
                    <i className="ri-logout-box-r-line"></i>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;