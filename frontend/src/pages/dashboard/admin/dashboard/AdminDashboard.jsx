import React, { useState } from 'react'
import { useLogoutUserMutation } from '../../../../redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../../../redux/features/auth/authSlice';
import { toast } from 'react-hot-toast';
import { LayoutDashboard, PlusCircle, Package, Users, ShoppingCart, MessageSquare, LogOut, Menu, X } from 'lucide-react';

// ✅ Import the Orders Query to count pending requests
import { useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi';

const AdminDashboard = () => {
    const [logoutUser] = useLogoutUserMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ✅ Mobile Menu State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // ✅ LIVE POLLING: Check for pending orders/chats every 5 seconds
    const { data: orders } = useGetAllOrdersQuery(undefined, { 
        pollingInterval: 5000, 
        refetchOnMountOrArgChange: true 
    });

    // ✅ FAIL-SAFE: Ensure we are filtering an array, preventing React crashes!
    const ordersList = Array.isArray(orders) ? orders : (orders?.orders || []);
    const pendingCount = ordersList.filter(o => o.status === 'pending').length;

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logout());
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            toast.success("Logged out from session!");
            navigate("/");
        } catch (err) {
            dispatch(logout());
            navigate("/login");
        }
    }

    const navItemStyle = ({ isActive }) => 
        `flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-300 w-full ${
            isActive ? "bg-slate-100 text-slate-900 shadow-md font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
        }`;

    return (
        <>
            {/* ✅ MOBILE HAMBURGER BUTTON */}
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="md:hidden fixed top-4 right-4 z-[60] p-2 bg-[#0f172a] text-white rounded-lg shadow-lg"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                {/* Mobile floating notification dot if menu is closed */}
                {!isMobileMenuOpen && pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                    </span>
                )}
            </button>

            {/* ✅ MOBILE OVERLAY (Darkens background when menu is open) */}
            {isMobileMenuOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* ✅ RESPONSIVE SIDEBAR */}
            <div className={`fixed left-0 top-0 h-screen bg-[#0f172a] p-5 w-64 md:w-72 flex flex-col justify-between shadow-2xl border-r border-slate-800 z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                
                <div>
                    <div className="nav__logo bg-white p-4 rounded-xl shadow-lg mb-8 border border-slate-200">
                        <Link to="/" className="text-xl font-black tracking-tighter text-slate-900">
                            Lebaba<span className="text-red-600">.</span>
                        </Link>
                        <p className='text-[9px] uppercase tracking-widest font-bold text-slate-400'>Admin Panel</p>
                    </div>
                    
                    <ul className="space-y-2">
                        <li><NavLink to="/dashboard/admin" onClick={() => setIsMobileMenuOpen(false)} className={navItemStyle}><div className="flex items-center gap-3"><LayoutDashboard size={18}/> <span className="text-xs uppercase">Dashboard</span></div></NavLink></li>
                        <li><NavLink to="/dashboard/add-product" onClick={() => setIsMobileMenuOpen(false)} className={navItemStyle}><div className="flex items-center gap-3"><PlusCircle size={18}/> <span className="text-xs uppercase">Add Product</span></div></NavLink></li>
                        <li><NavLink to="/dashboard/inventory" onClick={() => setIsMobileMenuOpen(false)} className={navItemStyle}><div className="flex items-center gap-3"><Package size={18}/> <span className="text-xs uppercase">Inventory</span></div></NavLink></li>
                        <li><NavLink to="/dashboard/users" onClick={() => setIsMobileMenuOpen(false)} className={navItemStyle}><div className="flex items-center gap-3"><Users size={18}/> <span className="text-xs uppercase">Users</span></div></NavLink></li>
                        <li><NavLink to="/dashboard/manage-orders" onClick={() => setIsMobileMenuOpen(false)} className={navItemStyle}><div className="flex items-center gap-3"><ShoppingCart size={18}/> <span className="text-xs uppercase">Orders</span></div></NavLink></li>
                        
                        {/* ✅ WHATSAPP STYLE CHAT NOTIFICATION */}
                        <li>
                            <NavLink to="/dashboard/chats" onClick={() => setIsMobileMenuOpen(false)} className={navItemStyle}>
                                <div className="flex items-center gap-3">
                                    <MessageSquare size={18}/> <span className="text-xs uppercase">Chats</span>
                                </div>
                                {pendingCount > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.7)]">
                                        {pendingCount} New
                                    </span>
                                )}
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="mt-auto">
                    <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full bg-red-600 text-white font-bold py-2.5 rounded-lg hover:bg-red-700 transition-all shadow-md">
                        <LogOut size={16} /> <span className="text-xs uppercase">Logout Session</span>
                    </button>
                </div>
            </div>
        </>
    )
}

export default AdminDashboard;  