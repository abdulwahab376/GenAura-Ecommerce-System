import React, { useState, useEffect } from 'react';
import { useLogoutUserMutation } from '../../../../redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../../../redux/features/auth/authSlice';
import { toast } from 'react-hot-toast';
import { LayoutDashboard, PlusCircle, Package, Users, ShoppingCart, MessageSquare, LogOut, Menu, X } from 'lucide-react';
import { useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi';

const AdminDashboard = () => {
    const [logoutUser] = useLogoutUserMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Forces the component to redraw the badges every second
    const [tick, setTick] = useState(0);

    const { data: orders } = useGetAllOrdersQuery(undefined, {
        pollingInterval: 5000,
        refetchOnMountOrArgChange: true
    });

    const ordersList = Array.isArray(orders) ? orders : (orders?.orders || []);

    // ✅ THE BUG FIX: Made it case-insensitive so it actually counts your "Pending" orders!
    const pendingOrdersCount = ordersList.filter(o => o.status?.toLowerCase() === 'pending').length;

    // ✅ DIRECT STORAGE SCANNER: Guaranteed to find unread chats
    const getUnreadChatCount = () => {
        let count = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('chat_') && key.endsWith('_messages')) {
                const orderId = key.replace('chat_', '').replace('_messages', '');
                const msgs = JSON.parse(localStorage.getItem(key) || '[]');
                const isRead = localStorage.getItem(`chat_read_${orderId}`) === 'true';

                if (!isRead && msgs.length > 1) {
                    count += 1;
                }
            }
        }
        return count;
    };

    const unreadChatCount = getUnreadChatCount();

    // ✅ HEARTBEAT: Checks for new messages constantly
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    // ✅ RECEIVER AND SOUND MAKER
    useEffect(() => {
        const channel = new BroadcastChannel('payment_sync');
        channel.onmessage = (event) => {
            if (event.data?.messages && event.data?.orderId) {
                localStorage.setItem(`chat_${event.data.orderId}_messages`, JSON.stringify(event.data.messages));
                localStorage.setItem(`chat_${event.data.orderId}_status`, event.data.status);
                localStorage.setItem(`chat_read_${event.data.orderId}`, 'false');

                const msgs = event.data.messages;
                const lastMsg = msgs[msgs.length - 1];

                if (lastMsg && lastMsg.sender === 'user') {
                    // 1. Show the red popup
                    toast.success("New message from customer!", { style: { background: '#ef4444', color: '#fff', fontWeight: 'bold' } });

                    // 2. Trigger the physical HTML audio tag we just added
                    const soundElement = document.getElementById('chat-alert-sound');
                    if (soundElement) {
                        soundElement.play().catch(e => console.error("BROWSER BLOCKED AUDIO! You must click the screen once.", e));
                    }
                }
            }
            setTick(t => t + 1);
        };
        return () => channel.close();
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logout());
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            toast.success("Logged out successfully!");
            navigate("/");
        } catch (err) {
            dispatch(logout());
            navigate("/login");
        }
    }

    const navItemStyle = ({ isActive }) =>
        `flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-300 w-full ${isActive ? "bg-slate-100 text-slate-900 shadow-md font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
        }`;

    return (
        <>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden fixed top-4 right-4 z-[60] p-2 bg-[#0f172a] text-white rounded-lg shadow-lg">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                {!isMobileMenuOpen && (pendingOrdersCount > 0 || unreadChatCount > 0) && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                    </span>
                )}
            </button>

            {isMobileMenuOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)} />}

            <div className={`fixed left-0 top-0 h-screen bg-[#0f172a] p-5 w-64 md:w-72 flex flex-col justify-between shadow-2xl border-r border-slate-800 z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div>
                    <div className="nav__logo bg-white p-4 rounded-xl shadow-lg mb-8 border border-slate-200">
                        <Link to="/" className="text-xl font-black tracking-tighter text-slate-900">Lebaba<span className="text-red-600">.</span></Link>
                        <p className='text-[9px] uppercase tracking-widest font-bold text-slate-400'>Admin Panel</p>
                    </div>

                    <ul className="space-y-2">
                        <li><NavLink to="/dashboard/admin" end onClick={() => setIsMobileMenuOpen(false)} className={navItemStyle}><div className="flex items-center gap-3"><LayoutDashboard size={18} strokeWidth={1.8} /> <span className="text-xs uppercase font-medium tracking-wider">Dashboard</span></div></NavLink></li>
                        <li><NavLink to="/dashboard/add-new-post" onClick={() => setIsMobileMenuOpen(false)} className={navItemStyle}><div className="flex items-center gap-3"><PlusCircle size={18} strokeWidth={1.8} /> <span className="text-xs uppercase font-medium tracking-wider">Add Product</span></div></NavLink></li>
                        <li><NavLink to="/dashboard/manage-products" onClick={() => setIsMobileMenuOpen(false)} className={navItemStyle}><div className="flex items-center gap-3"><Package size={18} strokeWidth={1.8} /> <span className="text-xs uppercase font-medium tracking-wider">Inventory</span></div></NavLink></li>
                        <li><NavLink to="/dashboard/users" onClick={() => setIsMobileMenuOpen(false)} className={navItemStyle}><div className="flex items-center gap-3"><Users size={18} strokeWidth={1.8} /> <span className="text-xs uppercase font-medium tracking-wider">Users</span></div></NavLink></li>

                        {/* ✅ ORDERS BADGE NOW WORKS */}
                        <li>
                            <NavLink to="/dashboard/manage-orders" onClick={() => setIsMobileMenuOpen(false)} className={navItemStyle}>
                                <div className="flex items-center gap-3"><ShoppingCart size={18} strokeWidth={1.8} /> <span className="text-xs uppercase font-medium tracking-wider">Orders</span></div>
                                {pendingOrdersCount > 0 && <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{pendingOrdersCount}</span>}
                            </NavLink>
                        </li>

                        {/* ✅ PERMANENT CHAT BADGE */}
                        <li>
                            <NavLink to="/dashboard/chats" onClick={() => setIsMobileMenuOpen(false)} className={navItemStyle}>
                                <div className="flex items-center gap-3">
                                    <MessageSquare size={18} strokeWidth={1.8} /> <span className="text-xs uppercase font-medium tracking-wider">Chats</span>
                                </div>
                                {unreadChatCount > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.7)]">
                                        {unreadChatCount} New
                                    </span>
                                )}
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="mt-auto">
                    <hr className="mb-4 border-slate-800" />
                    <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full bg-red-600 text-white font-bold py-2.5 rounded-lg hover:bg-red-700 transition-all shadow-md active:scale-95">
                        <LogOut size={16} strokeWidth={2} /> <span className="text-xs uppercase tracking-wider">Logout Account</span>
                    </button>
                </div>
            </div>
            {/* HIDDEN AUDIO TAG FOR CHAT NOTIFICATIONS */}
            <audio id="chat-alert-sound" src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" preload="auto"></audio>
        </>
    )
}

export default AdminDashboard;