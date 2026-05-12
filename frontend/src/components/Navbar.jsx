// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import CartModal from '../pages/shop/CartModal';
// import avatarImg from "../assets/avatar.png";
// import { logout } from '../redux/features/auth/authSlice';
// import { useLogoutUserMutation } from '../redux/features/auth/authApi';
// import io from "socket.io-client"; // ✅ 1. Socket client import karein

// // ✅ 2. Socket connection set karein
// const socket = io("http://localhost:5000"); 

// const Navbar = () => {
//   const products = useSelector((store) => store.cart.products);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const handleCartToggle = () => setIsCartOpen(!isCartOpen);

//   const dispatch = useDispatch();
//   const [logoutUser] = useLogoutUserMutation();
//   const { user } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   const [activeCategory, setActiveCategory] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
//   // Admin Notification State
//   const [totalUnread, setTotalUnread] = useState(0);

//   // ✅ 3. Database se Unread Count lane ka function
//   const fetchUnreadCount = async () => {
//     if (user?.role !== 'admin') return;
//     try {
//       const response = await fetch("http://localhost:5000/api/chats/admin/unread-count");
//       const data = await response.json();
//       if (data.count !== undefined) {
//         setTotalUnread(data.count);
//       }
//     } catch (error) {
//       console.error("Error fetching unread count:", error);
//     }
//   };

//   useEffect(() => {
//     // Pehli baar load hone par DB se count lo
//     fetchUnreadCount();

//     if (user?.role === 'admin') {
//       // ✅ 4. Live Socket Listener
//       socket.on("admin_notification", () => {
//         // Agar admin chat page par nahi hai to count barhao
//         if (window.location.pathname !== "/dashboard/chats") {
//           setTotalUnread(prev => prev + 1);
//         }
//       });
//     }

//     return () => {
//       socket.off("admin_notification");
//     };
//   }, [user]);

//   const handleLogout = async () => {
//     try {
//       await logoutUser().unwrap();
//       dispatch(logout());
//       navigate("/");
//     } catch (err) { console.error("Failed to logout:", err); }
//   };

//   // --- Category Data & Menus (Same as before) ---
//   const categoryData = {
//     men: ["shirts", "pants", "shoes", "watches","jackets"],
//     women: ["dress", "jewellery","shirts" ,"handbags", "cosmetics"],
//     kids: ["kids suits", "T-shirts", "pants" , "jackets","shoes"]
//   };

//   const adminDropdownMenus = [
//     { label: "Dashboard", path: "/dashboard/admin" },
//     { label: `Messages ${totalUnread > 0 ? `(${totalUnread})` : ''}`, path: "/dashboard/chats" }, 
//     { label: "Manage Items", path: "/dashboard/manage-products" },
//     { label: "All Orders", path: "/dashboard/manage-orders" },
//     { label: "Add New Post", path: "/dashboard/add-new-post" }
//   ];

//   const userDropdownMenus = [
//     { label: "Dashboard", path: "/dashboard" },
//     { label: "Profile", path: "/dashboard/profile" }, 
//     { label: "Payments", path: "/dashboard/payments" },
//     { label: "Orders", path: "/dashboard/orders" },
//     { label: "Payment Support", path: "/dashboard/payment-support" },
//   ];

//   const dropdownMenus = user?.role === 'admin' ? adminDropdownMenus : userDropdownMenus;

//   return (
//     <header className="fixed-nav-bar w-nav bg-white shadow-sm">
//       <nav className="max-w-screen-2xl mx-auto px-4 flex justify-between items-center h-20">
        
//         {/* Navigation Links */}
//         <ul className="nav__links flex items-center gap-6">
//           <li className="link font-semibold hover:text-primary"><Link to="/">Home</Link></li>
//           {Object.keys(categoryData).map((cat) => (
//             <li key={cat} className="relative group py-2" onMouseEnter={() => setActiveCategory(cat)} onMouseLeave={() => setActiveCategory(null)}>
//               <Link to={`/shop?mainCategory=${cat}`} className={`link font-semibold capitalize flex items-center gap-1 transition-colors ${activeCategory === cat ? 'text-primary' : ''}`}>
//                 {cat} <i className={`ri-arrow-down-s-line transition-transform ${activeCategory === cat ? 'rotate-180' : ''}`}></i>
//               </Link>
//               {activeCategory === cat && (
//                 <div className="absolute left-0 top-full w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-4 animate-fadeIn">
//                   <div className="flex flex-col gap-2">
//                     <p className="text-[11px] uppercase tracking-widest font-black text-slate-400 mb-1 px-2">Sub Categories</p>
//                     {categoryData[cat].map((sub) => (
//                       <Link key={sub} to={`/shop?category=${sub}&mainCategory=${cat}`} className="text-[15px] font-bold text-slate-600 hover:text-primary hover:bg-primary/5 px-2 py-2 rounded-lg transition-all capitalize" onClick={() => setActiveCategory(null)}>
//                         {sub}
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </li>
//           ))}
//           <li className="link font-semibold hover:text-primary"><Link to="/shop">Shop</Link></li>
//           <li className="link font-semibold hover:text-primary"><Link to="/contact">Contact</Link></li>
//         </ul>

//         {/* Logo */}
//         <div className="nav__logo text-2xl font-black">
//           <Link to="/">Lebaba<span className="text-primary">.</span></Link>
//         </div>

//         {/* Icons & Profile */}
//         <div className="nav__icons flex items-center gap-5">
//           <Link to="/search" className="hover:text-primary"><i className="ri-search-line text-lg"></i></Link>
//           <button onClick={handleCartToggle} className='hover:text-primary relative'>
//             <i className="ri-shopping-bag-line text-lg"></i>
//             <sup className="absolute -top-1 -right-2 text-[10px] font-bold h-4 w-4 flex items-center justify-center text-white rounded-full bg-primary shadow-sm">{products.length}</sup>
//           </button>

//           <div className="relative">
//             {user ? (
//               <>
//                 <div className="relative inline-block">
//                   <img
//                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                     src={user.profileImage ? user.profileImage : avatarImg}
//                     alt="User"
//                     className='size-10 rounded-full cursor-pointer object-cover ring-2 ring-primary/10 hover:ring-primary transition-all'
//                     referrerPolicy="no-referrer"
//                     onError={(e) => { e.target.onerror = null; e.target.src = avatarImg; }}
//                   />
                  
//                   {/* Notification Dot */}
//                   {user.role === 'admin' && totalUnread > 0 && (
//                     <span className="absolute -top-1 -right-1 flex h-4 w-4">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                       <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] text-white items-center justify-center font-bold border border-white">
//                         {totalUnread}
//                       </span>
//                     </span>
//                   )}
//                 </div>

//                 {isDropdownOpen && (
//                   <div className="absolute right-0 mt-3 p-4 w-60 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 animate-fadeIn">
//                     <p className='text-base font-black text-slate-800 px-3 truncate'>{user?.username}</p>
//                     <p className='text-xs text-slate-400 px-3 mb-3 truncate border-b pb-3'>{user?.email}</p>
//                     <ul className="space-y-1">
//                       {dropdownMenus.map((menu, i) => (
//                         <li key={i}>
//                           <Link to={menu.path} onClick={() => setIsDropdownOpen(false)} className="block px-3 py-2.5 text-[15px] font-bold text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
//                             {menu.label}
//                           </Link>
//                         </li>
//                       ))}
//                       <li className="pt-2 border-t mt-2">
//                         <button onClick={handleLogout} className='text-[15px] text-red-500 font-bold px-3 py-2.5 w-full text-left hover:bg-red-50 rounded-xl transition-all flex items-center gap-2'>
//                           <i className="ri-logout-box-r-line"></i> Logout
//                         </button>
//                       </li>
//                     </ul>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <Link to="/login"><i className="ri-user-line text-2xl hover:text-primary"></i></Link>
//             )}
//           </div>
//         </div>
//       </nav>
//       {isCartOpen && <CartModal products={products} isOpen={isCartOpen} onClose={handleCartToggle} />}
//     </header>
//   );
// };

// export default Navbar;



import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CartModal from '../pages/shop/CartModal';
import avatarImg from "../assets/avatar.png";
import { logout } from '../redux/features/auth/authSlice';
import { useLogoutUserMutation } from '../redux/features/auth/authApi';
import { toggleCart } from '../redux/features/cart/cartSlice'; // ✅ 1. toggleCart import kiya
import io from "socket.io-client";

const socket = io("http://localhost:5000"); 

const Navbar = () => {
  const products = useSelector((store) => store.cart.products);
  
  // ✅ 2. Local state khatam karke Redux se "isOpen" uthaya
  const isCartOpen = useSelector((state) => state.cart.isOpen); 
  const dispatch = useDispatch();
  
  // ✅ 3. Handle cart toggle ab Redux dispatch karega
  const handleCartToggle = () => dispatch(toggleCart());

  const [logoutUser] = useLogoutUserMutation();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  const fetchUnreadCount = async () => {
    if (user?.role !== 'admin') return;
    try {
      const response = await fetch("http://localhost:5000/api/chats/admin/unread-count");
      const data = await response.json();
      if (data.count !== undefined) {
        setTotalUnread(data.count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    if (user?.role === 'admin') {
      socket.on("admin_notification", () => {
        if (window.location.pathname !== "/dashboard/chats") {
          setTotalUnread(prev => prev + 1);
        }
      });
    }
    return () => { socket.off("admin_notification"); };
  }, [user]);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) { console.error("Failed to logout:", err); }
  };

  const categoryData = {
    men: ["shirts", "pants", "shoes", "watches","jackets"],
    women: ["dress", "jewellery","shirts" ,"handbags", "cosmetics"],
    kids: ["kids suits", "T-shirts", "pants" , "jackets","shoes"]
  };

  const adminDropdownMenus = [
    { label: "Dashboard", path: "/dashboard/admin" },
    { label: `Messages ${totalUnread > 0 ? `(${totalUnread})` : ''}`, path: "/dashboard/chats" }, 
    { label: "Manage Items", path: "/dashboard/manage-products" },
    { label: "All Orders", path: "/dashboard/manage-orders" },
    { label: "Add New Post", path: "/dashboard/add-new-post" }
  ];

  const userDropdownMenus = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/dashboard/profile" }, 
    { label: "Payments", path: "/dashboard/payments" },
    { label: "Orders", path: "/dashboard/orders" },
    { label: "Payment Support", path: "/dashboard/payment-support" },
  ];

  const dropdownMenus = user?.role === 'admin' ? adminDropdownMenus : userDropdownMenus;

  return (
    <header className="fixed-nav-bar w-nav bg-white shadow-sm">
      <nav className="max-w-screen-2xl mx-auto px-4 flex justify-between items-center h-20">
        
        {/* Navigation Links */}
        <ul className="nav__links flex items-center gap-6">
          <li className="link font-semibold hover:text-primary"><Link to="/">Home</Link></li>
          {Object.keys(categoryData).map((cat) => (
            <li key={cat} className="relative group py-2" onMouseEnter={() => setActiveCategory(cat)} onMouseLeave={() => setActiveCategory(null)}>
              <Link to={`/shop?mainCategory=${cat}`} className={`link font-semibold capitalize flex items-center gap-1 transition-colors ${activeCategory === cat ? 'text-primary' : ''}`}>
                {cat} <i className={`ri-arrow-down-s-line transition-transform ${activeCategory === cat ? 'rotate-180' : ''}`}></i>
              </Link>
              {activeCategory === cat && (
                <div className="absolute left-0 top-full w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-4 animate-fadeIn">
                  <div className="flex flex-col gap-2">
                    <p className="text-[11px] uppercase tracking-widest font-black text-slate-400 mb-1 px-2">Sub Categories</p>
                    {categoryData[cat].map((sub) => (
                      <Link key={sub} to={`/shop?category=${sub}&mainCategory=${cat}`} className="text-[15px] font-bold text-slate-600 hover:text-primary hover:bg-primary/5 px-2 py-2 rounded-lg transition-all capitalize" onClick={() => setActiveCategory(null)}>
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
          <li className="link font-semibold hover:text-primary"><Link to="/shop">Shop</Link></li>
          <li className="link font-semibold hover:text-primary"><Link to="/contact">Contact</Link></li>
        </ul>

        {/* Logo */}
        <div className="nav__logo text-2xl font-black">
          <Link to="/">Lebaba<span className="text-primary">.</span></Link>
        </div>

        {/* Icons & Profile */}
        <div className="nav__icons flex items-center gap-5">
          <Link to="/search" className="hover:text-primary"><i className="ri-search-line text-lg"></i></Link>
          <button onClick={handleCartToggle} className='hover:text-primary relative'>
            <i className="ri-shopping-bag-line text-lg"></i>
            <sup className="absolute -top-1 -right-2 text-[10px] font-bold h-4 w-4 flex items-center justify-center text-white rounded-full bg-primary shadow-sm">{products.length}</sup>
          </button>

          <div className="relative">
            {user ? (
              <>
                <div className="relative inline-block">
                  <img
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    src={user.profileImage ? user.profileImage : avatarImg}
                    alt="User"
                    className='size-10 rounded-full cursor-pointer object-cover ring-2 ring-primary/10 hover:ring-primary transition-all'
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.target.onerror = null; e.target.src = avatarImg; }}
                  />
                  {user.role === 'admin' && totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] text-white items-center justify-center font-bold border border-white">
                        {totalUnread}
                      </span>
                    </span>
                  )}
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 p-4 w-60 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 animate-fadeIn">
                    <p className='text-base font-black text-slate-800 px-3 truncate'>{user?.username}</p>
                    <p className='text-xs text-slate-400 px-3 mb-3 truncate border-b pb-3'>{user?.email}</p>
                    <ul className="space-y-1">
                      {dropdownMenus.map((menu, i) => (
                        <li key={i}>
                          <Link to={menu.path} onClick={() => setIsDropdownOpen(false)} className="block px-3 py-2.5 text-[15px] font-bold text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                            {menu.label}
                          </Link>
                        </li>
                      ))}
                      <li className="pt-2 border-t mt-2">
                        <button onClick={handleLogout} className='text-[15px] text-red-500 font-bold px-3 py-2.5 w-full text-left hover:bg-red-50 rounded-xl transition-all flex items-center gap-2'>
                          <i className="ri-logout-box-r-line"></i> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login"><i className="ri-user-line text-2xl hover:text-primary"></i></Link>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ 4. Modal ab hamesha render hoga, uski apni Redux state usay control karegi */}
      <CartModal products={products} />
    </header>
  );
};

export default Navbar;