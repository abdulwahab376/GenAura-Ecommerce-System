// import React from 'react';
// import { Outlet, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import AdminDashboard from './AdminDashboard'; 
// // ✅ 1. Import your User Sidebar here! (Make sure the path and name are correct for your app)
// import UserDashboard from './UserDashboard'; 

// const DashboardLayout = () => {
//     const { user } = useSelector((state) => state.auth);

//     if (!user) {
//         return <Navigate to="/login" replace />;
//     }

//     const isAdmin = user?.role === 'admin';

//     return (
//         <div className="flex min-h-screen bg-gray-50 font-sans">
            
//             {/* ✅ 2. Show Admin sidebar for Admins, and User sidebar for regular users! */}
//             {isAdmin ? <AdminDashboard /> : <UserDashboard />}

//             {/* ✅ 3. We keep the margin (md:ml-72) so the content doesn't hide behind EITHER sidebar */}
//             <div className="flex-1 w-full md:ml-72 p-4 md:p-8 transition-all duration-300 overflow-x-hidden">
//                 <Outlet />
//             </div>
//         </div>
//     );
// };

// export default DashboardLayout;

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);

  // 1. Authentication Check
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role-based Sidebar Render
  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'user':
        return <UserDashboard />;
      default:
        return <Navigate to="/login" replace />; // Role na mile to wapis login par
    }
  };

  return (
    // 'container mx-auto' ki jagah 'w-full' use kiya hai taake screen poori cover ho
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-50'>
      
      {/* Sidebar Area: Width ko professional rakha hai */}
      <header className='lg:w-1/5 md:w-1/4 w-full bg-white shadow-md z-10'>
        {renderDashboard()}
      </header>

      {/* Main Content Area */}
      <main className='flex-1 p-4 md:p-10 bg-[#f8fafc] overflow-y-auto'>
        <div className='max-w-7xl mx-auto'>
           {/* Outlet mein wo pages aayenge jo routes mein define hain */}
           <Outlet />
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;