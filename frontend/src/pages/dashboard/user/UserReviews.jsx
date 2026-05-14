// // import React from 'react';
// // import { useSelector } from 'react-redux';
// // import { useGetReviewsByUserIdQuery } from '../../../redux/features/reviews/reviewApi';
// // import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

// // const UserReviews = () => {
// //   const { user } = useSelector((state) => state.auth);
// //   const { data: reviews, error, isLoading } = useGetReviewsByUserIdQuery(user?._id);
// //   console.log(reviews)
// //   const navigate = useNavigate(); 

// //   if (isLoading) {
// //     return <p>Loading reviews...</p>;
// //   }

// //   if (error) {
// //     return <p>No reviews given yet.</p>;
// //   }

// //   const handleCardClick = () => {
// //     navigate('/shop'); 
// //   };

// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-bold mb-4">Your Given Reviews</h1>
// //       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
// //         {reviews && reviews.map((review) => (
// //           <div
// //             key={review._id}
// //             className="bg-white shadow-md rounded-lg p-4 border border-gray-200 cursor-pointer hover:scale-105 transition-all duration-200"
// //           >
// //             <p className="text-lg font-semibold mb-2">Rating: {review.rating}</p>
// //             <p className="mb-2"><strong>Comment:</strong> {review.comment}</p>
// //             <p className="text-sm text-gray-600 mb-2"><strong>Product ID:</strong> {review.productId}</p>
// //             <p className="text-sm text-gray-500"><strong>Created At:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
// //           </div>
// //         ))}
// //         <div
// //           className="bg-gray-100 text-black flex items-center justify-center rounded-lg p-6 border border-gray-200 cursor-pointer hover:bg-primary hover:text-white transition-all duration-200"
// //           onClick={handleCardClick}
// //         >
// //           <span className="text-3xl font-bold">+</span>
// //           <p className="ml-2 text-lg">Add New Review</p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UserReviews;


// import React from 'react';
// import { useSelector } from 'react-redux';
// import { useGetReviewsByUserIdQuery } from '../../../redux/features/reviews/reviewApi';
// import { useNavigate } from 'react-router-dom';

// const UserReviews = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { data: reviews, error, isLoading } = useGetReviewsByUserIdQuery(user?._id);
//   const navigate = useNavigate();

//   if (isLoading) return <div className="p-6 text-gray-500">Loading reviews...</div>;

//   // Render Stars function
//   const renderStars = (rating) => {
//     return (
//       <div className="flex text-yellow-500">
//         {[...Array(5)].map((_, index) => (
//           <i key={index} className={index < rating ? "ri-star-fill" : "ri-star-line text-gray-300"}></i>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="p-6 bg-[#f8fafc] min-h-screen">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Given Reviews</h1>
      
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {reviews && reviews.map((review) => (
//           <div
//             key={review._id}
//             className="bg-white shadow-sm rounded-xl p-5 border border-gray-100 hover:shadow-md transition-all duration-300"
//           >
//             <div className="flex justify-between items-start mb-3">
//                {renderStars(review.rating)}
//                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
//                 {new Date(review.createdAt).toLocaleDateString()}
//                </span>
//             </div>

//             <p className="text-gray-700 italic mb-4">"{review.comment}"</p>
            
//             <div className="pt-3 border-t border-gray-50">
//                 <p className="text-xs text-blue-600 font-medium">
//                   <i className="ri-hashtag mr-1"></i>
//                   Product ID: {review.productId.substring(0, 10)}...
//                 </p>
//             </div>
//           </div>
//         ))}

//         {/* Add New Review Card - Matching Button Style */}
//         <div
//           onClick={() => navigate('/shop')}
//           className="bg-blue-50 text-blue-600 flex flex-col items-center justify-center rounded-xl p-6 border-2 border-dashed border-blue-200 cursor-pointer hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 group"
//         >
//           <div className="bg-white p-3 rounded-full mb-2 group-hover:bg-blue-500 transition-colors">
//              <i className="ri-add-line text-2xl"></i>
//           </div>
//           <p className="font-bold">Add New Review</p>
//         </div>
//       </div>

//       {(!reviews || reviews.length === 0) && (
//         <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100 mt-5">
//            <i className="ri-chat-voice-line text-4xl text-gray-300"></i>
//            <p className="text-gray-500 mt-2">No reviews given yet.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserReviews;




import React from 'react';
import { useSelector } from 'react-redux';
import { useGetReviewsByUserIdQuery } from '../../../redux/features/reviews/reviewApi';
import { useNavigate } from 'react-router-dom';

const UserReviews = () => {
  const { user } = useSelector((state) => state.auth);
  
  // RTK Query hook to fetch data
  const { data: reviews = [], isLoading, error } = useGetReviewsByUserIdQuery(user?._id, {
    skip: !user?._id // Jab tak user ID na ho, call na karein
  });
  
  const navigate = useNavigate();

  if (isLoading) return <div className="p-6 text-gray-500 animate-pulse font-bold tracking-widest text-center mt-20">LOADING YOUR REVIEWS...</div>;
  if (error) return <div className="p-6 text-red-500 text-center mt-20 font-bold">Failed to load reviews.</div>;

  const renderStars = (rating) => (
    <div className="flex text-amber-400 gap-0.5">
      {[...Array(5)].map((_, index) => (
        <i key={index} className={index < rating ? "ri-star-fill text-sm" : "ri-star-line text-gray-200 text-sm"}></i>
      ))}
    </div>
  );

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Your Reviews</h1>
          <p className="text-xs text-slate-400 font-bold tracking-widest mt-1">HISTORY OF YOUR FEEDBACK</p>
        </div>
        <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-indigo-100">
           {reviews?.length || 0} Total
        </div>
      </div>
      
      {/* Reviews Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.length > 0 && reviews.map((review) => {
          const product = review?.productId;
          const hasProductData = product && typeof product === 'object';
          
          // ID extract kar rahe hain navigation ke liye
          const productId = hasProductData ? product._id : review?.productId;
          const productName = hasProductData ? product.name : 'Product Not Found';
          
          // --- IMAGE CLEANER LOGIC ---
          // Cloudinary comma-separated links ko handle karne ke liye
          let productImage = 'https://via.placeholder.com/150';
          if (hasProductData && product.image) {
            const imageSource = String(product.image);
            if (imageSource.includes(',')) {
              const parts = imageSource.split(',');
              const validUrl = parts.find(p => p.trim().startsWith('http'));
              productImage = validUrl ? validUrl.trim() : parts[0].trim();
            } else {
              productImage = imageSource;
            }
          }

          return (
            <div key={review?._id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col hover:translate-y-[-5px] transition-all duration-300 group">
              {/* Product Info Header */}
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-50">
                 <div className="h-16 w-16 bg-slate-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                    <img 
                      src={productImage} 
                      alt={productName} 
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                    />
                 </div>
                 <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-800 text-sm truncate uppercase tracking-tight">
                      {productName}
                    </h3>
                    <div className="mt-1">
                      {renderStars(review?.rating || 0)}
                    </div>
                 </div>
              </div>

              {/* Review Comment */}
              <div className="flex-1">
                 <p className="text-slate-600 text-[13px] leading-relaxed italic">
                   <span className="text-indigo-400 font-serif text-xl mr-1">"</span>
                   {review?.comment || 'No comment provided'}
                   <span className="text-indigo-400 font-serif text-xl ml-1">"</span>
                 </p>
              </div>
              
              {/* Footer Actions */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">
                    {review?.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date unknown'}
                  </span>
                  
                  {/* Fixed Navigation Path based on your shop URL structure */}
                  <button 
                    onClick={() => productId && navigate(`/shop/${productId}`)}
                    className={`text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 group/btn ${!productId ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-800'}`}
                    disabled={!productId}
                  >
                    View Product <i className="ri-arrow-right-line group-hover/btn:translate-x-1 transition-transform"></i>
                  </button>
              </div>
            </div>
          );
        })}

        {/* Add Review / Shop More Card */}
        <div 
          onClick={() => navigate('/shop')} 
          className="bg-indigo-50 text-indigo-600 flex flex-col items-center justify-center rounded-[2rem] p-8 border-2 border-dashed border-indigo-200 cursor-pointer hover:bg-indigo-600 hover:text-white transition-all duration-500 group"
        >
          <div className="bg-white p-4 rounded-full mb-3 group-hover:bg-indigo-500 transition-colors shadow-sm">
             <i className="ri-add-line text-3xl"></i>
          </div>
          <p className="font-black uppercase tracking-widest text-xs text-center">Shop More <br/> & Give Feedback</p>
        </div>
      </div>
    </div>
  );
};

export default UserReviews;