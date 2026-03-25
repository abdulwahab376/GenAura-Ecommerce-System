// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import CartModal from '../pages/shop/CartModal';
// import avatarImg from "../assets/avatar.png";
// import { logout } from '../redux/features/auth/authSlice';
// import { useLogoutUserMutation } from '../redux/features/auth/authApi';

// const Navbar = () => {
//   // Cart functionality
//   const products = useSelector((store) => store.cart.products);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const handleCartToggle = () => {
//     setIsCartOpen(!isCartOpen);
//   };

//   // Show user if logged in
//   const dispatch =  useDispatch()
//   const [logoutUser] = useLogoutUserMutation();
//   const { user } = useSelector((state) => state.auth);
//   console.log(user)
//   // const user = true;
//   const navigate = useNavigate()
//   const handleLogout = async () => {
//     try {
//       await logoutUser().unwrap();
//       dispatch(logout());
//       navigate("/")
//     } catch (err) {
//       console.error("Failed to logout:", err);
//     }
//   };

//   // Dropdown for user menu
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const handleDropDownToggle = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   // Dropdown menu items


//   const adminDropdownMenus = [
//     { label: "Dashboard", path: "/dashboard/admin" },
//     { label: "Manage Items", path: "/dashboard/manage-products" },
//     {label: "All Orders", path: "/dashboard/manage-orders" },
//     { label: "Add New Post", path: "/dashboard/add-new-post" }
//   ];

//   const userDropdownMenus = [
//     { label: "Dashboard", path: "/dashboard" },
//     { label: "Profile", path: "/dashboard/profile" }, 
//     { label: "Payments", path: "/dashboard/payments" },
//     { label: "Orders", path: "/dashboard/orders" },
//   ];

//   const dropdownMenus = user?.role === 'admin'
//     ? [...adminDropdownMenus]
//     : [ ...userDropdownMenus];

//   return (
//     <header className="fixed-nav-bar w-nav">
//       <nav className="max-w-screen-2xl mx-auto px-4 flex justify-between items-center">
//         <ul className="nav__links">
//           <li className="link"><Link to="/">Home</Link></li>
//           <li className="link"><Link to="/shop">Shop</Link></li>
//           <li className="link"><Link to="/">Pages</Link></li>
//           <li className="link"><Link to="/contact">Contact</Link></li>
//         </ul>
//         <div className="nav__logo">
//           <Link to="/">Lebaba<span>.</span></Link>
//         </div>
//         <div className="nav__icons relative">
//           <span>
//             <Link to="/search"><i className="ri-search-line"></i></Link>
//           </span>
//           <span>
//             <button onClick={handleCartToggle} className='hover:text-primary'>
//               <i className="ri-shopping-bag-line"></i>
//               <sup className="text-sm inline-block px-1.5 text-white rounded-full bg-primary text-center">
//                 {products.length}
//               </sup>
//             </button>
//           </span>
//           <span>
//             {user ? (
//               <>
//                 <img
//                   onClick={handleDropDownToggle}
//                   src={user?.profileImage || avatarImg}
//                   alt="User Avatar"
//                   className='size-6 rounded-full cursor-pointer'
//                 />
//                 {isDropdownOpen && (
//                   <div className="absolute right-0 mt-3 p-4 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
//                     <ul className="font-medium space-y-4 p-2">
//                       {dropdownMenus.map((menu, index) => (
//                         <li key={index}>
//                           <Link onClick={() => setIsDropdownOpen(false)} to={menu.path} className="dropdown-items">
//                             {menu.label}
//                           </Link>
//                         </li>

//                       ))}
//                       <li>
//                         <Link onClick={handleLogout} className='dropdown-items'>Logout</Link>
//                       </li>
//                     </ul>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <Link to="/login"><i className="ri-user-line"></i></Link>
//             )}
//           </span>
//         </div>
//       </nav>

//       {isCartOpen && <CartModal products={products} isOpen={isCartOpen} onClose={handleCartToggle} />}
//     </header>
//   );
// };

// export default Navbar;







// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import CartModal from '../pages/shop/CartModal';
// import avatarImg from "../assets/avatar.png";
// import { logout } from '../redux/features/auth/authSlice';
// import { useLogoutUserMutation } from '../redux/features/auth/authApi';

// const Navbar = () => {
//   // Cart functionality
//   const products = useSelector((store) => store.cart.products);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const handleCartToggle = () => {
//     setIsCartOpen(!isCartOpen);
//   };

//   // Show user if logged in
//   const dispatch = useDispatch();
//   const [logoutUser] = useLogoutUserMutation();
//   const { user } = useSelector((state) => state.auth);
  
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await logoutUser().unwrap();
//       dispatch(logout());
//       navigate("/");
//     } catch (err) {
//       console.error("Failed to logout:", err);
//     }
//   };

//   // Dropdown for user menu
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const handleDropDownToggle = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const adminDropdownMenus = [
//     { label: "Dashboard", path: "/dashboard/admin" },
//     { label: "Manage Items", path: "/dashboard/manage-products" },
//     { label: "All Orders", path: "/dashboard/manage-orders" },
//     { label: "Add New Post", path: "/dashboard/add-new-post" }
//   ];

//   const userDropdownMenus = [
//     { label: "Dashboard", path: "/dashboard" },
//     { label: "Profile", path: "/dashboard/profile" }, 
//     { label: "Payments", path: "/dashboard/payments" },
//     { label: "Orders", path: "/dashboard/orders" },
//   ];

//   const dropdownMenus = user?.role === 'admin'
//     ? [...adminDropdownMenus]
//     : [...userDropdownMenus];

//   return (
//     <header className="fixed-nav-bar w-nav">
//       <nav className="max-w-screen-2xl mx-auto px-4 flex justify-between items-center">
//         <ul className="nav__links">
//           <li className="link"><Link to="/">Home</Link></li>
//           <li className="link"><Link to="/shop">Shop</Link></li>
//           <li className="link"><Link to="/">Pages</Link></li>
//           <li className="link"><Link to="/contact">Contact</Link></li>
//         </ul>

//         <div className="nav__logo">
//           <Link to="/">Lebaba<span>.</span></Link>
//         </div>

//         <div className="nav__icons relative">
//           <span>
//             <Link to="/search"><i className="ri-search-line"></i></Link>
//           </span>

//           <span>
//             <button onClick={handleCartToggle} className='hover:text-primary'>
//               <i className="ri-shopping-bag-line"></i>
//               <sup className="text-sm inline-block px-1.5 text-white rounded-full bg-primary text-center">
//                 {products.length}
//               </sup>
//             </button>
//           </span>

//           <span className="relative">
//             {user ? (
//               <>
//                 <img
//                   onClick={handleDropDownToggle}
//                   src={user?.profileImage || avatarImg}
//                   alt="User Avatar"
//                   className='size-9 rounded-full cursor-pointer object-cover border-2 border-primary/10 hover:border-primary transition-all shadow-sm'
//                 />
                
//                 {isDropdownOpen && (
//                   <div className="absolute right-0 mt-3 p-4 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
//                     {/* User Info Section */}
//                     <div className='px-2 pb-2 mb-2 border-b border-gray-100'>
//                        <p className='text-xs font-bold text-gray-800 truncate'>{user?.username || 'User'}</p>
//                        <p className='text-[10px] text-gray-500 truncate'>{user?.email || ''}</p>
//                     </div>

//                     <ul className="font-medium space-y-3 p-1">
//                       {dropdownMenus.map((menu, index) => (
//                         <li key={index}>
//                           <Link 
//                             onClick={() => setIsDropdownOpen(false)} 
//                             to={menu.path} 
//                             className="dropdown-items text-sm hover:text-primary transition-colors"
//                           >
//                             {menu.label}
//                           </Link>
//                         </li>
//                       ))}
//                       <li className="pt-2 border-t border-gray-50">
//                         <button 
//                           onClick={handleLogout} 
//                           className='text-sm text-red-500 hover:text-red-700 font-semibold w-full text-left'
//                         >
//                           Logout
//                         </button>
//                       </li>
//                     </ul>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <Link to="/login" className="hover:text-primary">
//                 <i className="ri-user-line text-xl"></i>
//               </Link>
//             )}
//           </span>
//         </div>
//       </nav>

//       {isCartOpen && <CartModal products={products} isOpen={isCartOpen} onClose={handleCartToggle} />}
//     </header>
//   );
// };

// export default Navbar;





import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CartModal from '../pages/shop/CartModal';
import avatarImg from "../assets/avatar.png";
import { logout } from '../redux/features/auth/authSlice';
import { useLogoutUserMutation } from '../redux/features/auth/authApi';

const Navbar = () => {
  const products = useSelector((store) => store.cart.products);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const handleCartToggle = () => setIsCartOpen(!isCartOpen);

  const dispatch = useDispatch();
  const [logoutUser] = useLogoutUserMutation();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  const [activeCategory, setActiveCategory] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categoryData = {
    men: ["shirts", "jeans", "shoes", "watches"],
    women: ["dress", "jewellery", "bags", "cosmetics"],
    kids: ["toys", "clothing", "school-bags"]
  };

  const adminDropdownMenus = [
    { label: "Dashboard", path: "/dashboard/admin" },
    { label: "Manage Items", path: "/dashboard/manage-products" },
    { label: "All Orders", path: "/dashboard/manage-orders" },
    { label: "Add New Post", path: "/dashboard/add-new-post" }
  ];

  const userDropdownMenus = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/dashboard/profile" }, 
    { label: "Payments", path: "/dashboard/payments" },
    { label: "Orders", path: "/dashboard/orders" },
  ];

  const dropdownMenus = user?.role === 'admin' ? adminDropdownMenus : userDropdownMenus;

  return (
    <header className="fixed-nav-bar w-nav bg-white shadow-sm">
      <nav className="max-w-screen-2xl mx-auto px-4 flex justify-between items-center h-20">
        
        {/* 1. Left: Navigation Links */}
        <ul className="nav__links flex items-center gap-6">
          <li className="link font-semibold hover:text-primary"><Link to="/">Home</Link></li>
          
          {Object.keys(categoryData).map((cat) => (
            <li 
              key={cat} 
              className="relative group py-2"
              onMouseEnter={() => setActiveCategory(cat)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <Link 
                to={`/shop?mainCategory=${cat}`} 
                className={`link font-semibold capitalize flex items-center gap-1 transition-colors ${activeCategory === cat ? 'text-primary' : ''}`}
                onClick={() => setActiveCategory(null)}
              >
                {cat} <i className={`ri-arrow-down-s-line transition-transform ${activeCategory === cat ? 'rotate-180' : ''}`}></i>
              </Link>

              {activeCategory === cat && (
                <div className="absolute left-0 top-full w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-4 animate-fadeIn">
                  <div className="flex flex-col gap-2">
                    <p className="text-[11px] uppercase tracking-widest font-black text-slate-400 mb-1 px-2">Sub Categories</p>
                    {categoryData[cat].map((sub) => (
                      <Link 
                        key={sub}
                        to={`/shop?category=${sub}`}
                        className="text-[15px] font-bold text-slate-600 hover:text-primary hover:bg-primary/5 px-2 py-2 rounded-lg transition-all capitalize"
                        onClick={() => setActiveCategory(null)}
                      >
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

        {/* 2. Center: Logo */}
        <div className="nav__logo text-2xl font-black">
          <Link to="/">Lebaba<span className="text-primary">.</span></Link>
        </div>

        {/* 3. Right: Icons & Profile */}
        <div className="nav__icons flex items-center gap-5">
          {/* Search */}
          <Link to="/search" className="hover:text-primary">
            <i className="ri-search-line text-lg"></i>
          </Link>

          {/* Cart */}
          <button onClick={handleCartToggle} className='hover:text-primary relative'>
            <i className="ri-shopping-bag-line text-lg"></i>
            <sup className="absolute -top-1 -right-2 text-[10px] font-bold h-4 w-4 flex items-center justify-center text-white rounded-full bg-primary shadow-sm">
              {products.length}
            </sup>
          </button>

          {/* User / Login */}
          <div className="relative">
            {user ? (
              <>
                <img
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  src={user?.profileImage || avatarImg}
                  alt="User"
                  className='size-10 rounded-full cursor-pointer object-cover ring-2 ring-primary/10 hover:ring-primary transition-all'
                />
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 p-4 w-60 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 animate-fadeIn">
                    <p className='text-base font-black text-slate-800 px-3 truncate'>{user?.username}</p>
                    <p className='text-xs text-slate-400 px-3 mb-3 truncate border-b pb-3'>{user?.email}</p>
                    <ul className="space-y-1">
                      {dropdownMenus.map((menu, i) => (
                        <li key={i}>
                          <Link 
                            to={menu.path} 
                            onClick={() => setIsDropdownOpen(false)} 
                            className="block px-3 py-2.5 text-[15px] font-bold text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                          >
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
              <Link to="/login">
                <i className="ri-user-line text-2xl hover:text-primary"></i>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {isCartOpen && <CartModal products={products} isOpen={isCartOpen} onClose={handleCartToggle} />}
    </header>
  );
};

export default Navbar;