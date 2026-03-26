import {React, useState, useEffect} from 'react'
import { useLogoutUserMutation } from '../../redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/features/auth/authSlice';
import { toast } from 'react-hot-toast';
import { LayoutDashboard, PlusCircle, Package, Users, ShoppingCart, MessageSquare, LogOut } from 'lucide-react';

const AdminDashboard = () => {
    const [logoutUser] = useLogoutUserMutation();
    const dispatch = useDispatch();
    const [unreadChatCount, setUnreadChatCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const channel = new BroadcastChannel('payment_sync');
        channel.onmessage = (event) => {
            if (event.data?.messages) {
                const msgs = event.data.messages;
                const lastMsg = msgs[msgs.length - 1];

                // If the user sent the last message, increase the red dot count!
                if (lastMsg && lastMsg.sender === 'user') {
                    setUnreadChatCount(prev => prev + 1);
                }
            }
        };
        return () => channel.close();
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logout());
            // Using sessionStorage for tab isolation
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            toast.success("Logged out successfully!", {
                style: { background: '#374151', color: '#fff' }
            });
            navigate("/");
        } catch (err) {
            console.error("Failed to logout:", err);
            dispatch(logout());
            navigate("/login");
        }
    }

    const navItemStyle = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ${isActive
            ? "bg-slate-100 text-slate-900 shadow-md font-bold"
            : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
        }`;

    return (
        <div className="fixed left-0 top-0 h-screen bg-[#0f172a] p-5 w-64 md:w-72 flex flex-col justify-between shadow-2xl border-r border-slate-800 z-50">
            <div>
                <div className="nav__logo bg-white p-4 rounded-xl shadow-lg mb-8 border border-slate-200">
                    <Link to="/" className="text-xl font-black tracking-tighter text-slate-900">
                        Lebaba<span className="text-red-600">.</span>
                    </Link>
                    <p className='text-[9px] uppercase tracking-widest font-bold text-slate-400'>Admin Panel</p>
                </div>

                <ul className="space-y-2">
                    <li>
                        <NavLink to="/dashboard/admin" end className={navItemStyle}>
                            <LayoutDashboard size={18} strokeWidth={1.8} />
                            <span className="text-xs uppercase tracking-wider font-medium">Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        {/*  FIXED PATH: Matches router.jsx */}
                        <NavLink to="/dashboard/add-new-post" className={navItemStyle}>
                            <PlusCircle size={18} strokeWidth={1.8} />
                            <span className="text-xs uppercase tracking-wider font-medium">Add Product</span>
                        </NavLink>
                    </li>
                    <li>
                        {/*  FIXED PATH: Matches router.jsx */}
                        <NavLink to="/dashboard/manage-products" className={navItemStyle}>
                            <Package size={18} strokeWidth={1.8} />
                            <span className="text-xs uppercase tracking-wider font-medium">Inventory</span>
                        </NavLink>
                    </li>
                    <li>
                        {/*  FIXED PATH: Matches router.jsx */}
                        <NavLink to="/dashboard/users" className={navItemStyle}>
                            <Users size={18} strokeWidth={1.8} />
                            <span className="text-xs uppercase tracking-wider font-medium">Users</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/manage-orders" className={navItemStyle}>
                            <ShoppingCart size={18} strokeWidth={1.8} />
                            <span className="text-xs uppercase tracking-wider font-medium">Orders</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard/chats"
                            className={navItemStyle}
                            onClick={() => setUnreadChatCount(0)} // Clears the badge when admin clicks the tab
                        >
                            <div className="flex items-center gap-3">
                                <MessageSquare size={18} strokeWidth={1.8} />
                                <span className="text-xs uppercase tracking-wider font-medium">Chats</span>
                            </div>

                            {/* RED NOTIFICATION BADGE */}
                            {unreadChatCount > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.7)] ml-2">
                                    {unreadChatCount}
                                </span>
                            )}
                        </NavLink>
                    </li>
                </ul>
            </div>

            <div className="mt-auto">
                <hr className="mb-4 border-slate-800" />
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full bg-red-600 text-white font-bold py-2.5 rounded-lg hover:bg-red-700 transition-all shadow-md active:scale-95"
                >
                    <LogOut size={16} strokeWidth={2} />
                    <span className="text-xs uppercase tracking-wider">Logout Account</span>
                </button>
            </div>
        </div>
    )
}

export default AdminDashboard;