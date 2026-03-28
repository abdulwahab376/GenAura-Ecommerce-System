// import React from 'react';


// const UserStats = ({stats}) => {


//   return (
//     <div className="my-5 space-y-4">
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:border-primary cursor-pointer hover:scale-105 transition-all duration-200">
//           <h2 className="text-xl font-semibold mb-2">Total Payments</h2>
//           <p className="text-2xl font-bold">${stats.totalPayments}</p>
//         </div>
//         <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:border-primary cursor-pointer hover:scale-105 transition-all duration-200">
//           <h2 className="text-xl font-semibold mb-2">Total Reviews</h2>
//           <p className="text-2xl font-bold">{stats.totalReviews}</p>
//         </div>
//         <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:border-primary cursor-pointer hover:scale-105 transition-all duration-200">
//           <h2 className="text-xl font-semibold mb-2">Total Purchased Products</h2>
//           <p className="text-2xl font-bold">{stats.totalPurchasedProducts}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserStats;


import React from 'react';

const UserStats = ({ stats }) => {
  // Safety check: Agar stats abhi load nahi huay to khali na dikhay
  if (!stats) return <div className="text-gray-500 italic">Loading your stats...</div>;

  return (
    <div className="my-5 space-y-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Total Payments */}
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-blue-500 cursor-pointer transition-all duration-300 group">
          <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-600 transition-colors duration-300">
            <i className="ri-wallet-3-line text-2xl text-blue-600 group-hover:text-white"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Payments</p>
            {/* ✅ Fixed: No extra zeros and added commas using toLocaleString */}
            <h2 className="text-2xl font-bold text-gray-800">
                Rs. {Number(stats.totalPayments || 0).toLocaleString('en-IN')}
            </h2>
          </div>
        </div>

        {/* Total Reviews */}
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-blue-500 cursor-pointer transition-all duration-300 group">
          <div className="bg-yellow-100 p-3 rounded-full group-hover:bg-yellow-500 transition-colors duration-300">
            <i className="ri-star-fill text-2xl text-yellow-500 group-hover:text-white"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Reviews</p>
            <h2 className="text-2xl font-bold text-gray-800">{stats.totalReviews || 0}</h2>
          </div>
        </div>

        {/* Total Purchased Products */}
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-blue-500 cursor-pointer transition-all duration-300 group">
          <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-600 transition-colors duration-300">
            <i className="ri-shopping-basket-2-line text-2xl text-green-600 group-hover:text-white"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Purchased Items</p>
            <h2 className="text-2xl font-bold text-gray-800">{stats.totalPurchasedProducts || 0}</h2>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserStats;