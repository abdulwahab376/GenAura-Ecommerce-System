// import React from 'react';
// import { useSelector } from 'react-redux';
// import { useGetReviewsByUserIdQuery } from '../../../redux/features/reviews/reviewApi';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

// const UserReviews = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { data: reviews, error, isLoading } = useGetReviewsByUserIdQuery(user?._id);
//   console.log(reviews)
//   const navigate = useNavigate(); 

//   if (isLoading) {
//     return <p>Loading reviews...</p>;
//   }

//   if (error) {
//     return <p>No reviews given yet.</p>;
//   }

//   const handleCardClick = () => {
//     navigate('/shop'); 
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Your Given Reviews</h1>
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {reviews && reviews.map((review) => (
//           <div
//             key={review._id}
//             className="bg-white shadow-md rounded-lg p-4 border border-gray-200 cursor-pointer hover:scale-105 transition-all duration-200"
//           >
//             <p className="text-lg font-semibold mb-2">Rating: {review.rating}</p>
//             <p className="mb-2"><strong>Comment:</strong> {review.comment}</p>
//             <p className="text-sm text-gray-600 mb-2"><strong>Product ID:</strong> {review.productId}</p>
//             <p className="text-sm text-gray-500"><strong>Created At:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
//           </div>
//         ))}
//         <div
//           className="bg-gray-100 text-black flex items-center justify-center rounded-lg p-6 border border-gray-200 cursor-pointer hover:bg-primary hover:text-white transition-all duration-200"
//           onClick={handleCardClick}
//         >
//           <span className="text-3xl font-bold">+</span>
//           <p className="ml-2 text-lg">Add New Review</p>
//         </div>
//       </div>
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
  const { data: reviews, error, isLoading } = useGetReviewsByUserIdQuery(user?._id);
  const navigate = useNavigate();

  if (isLoading) return <div className="p-6 text-gray-500">Loading reviews...</div>;

  // Render Stars function
  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-500">
        {[...Array(5)].map((_, index) => (
          <i key={index} className={index < rating ? "ri-star-fill" : "ri-star-line text-gray-300"}></i>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Given Reviews</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews && reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white shadow-sm rounded-xl p-5 border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3">
               {renderStars(review.rating)}
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {new Date(review.createdAt).toLocaleDateString()}
               </span>
            </div>

            <p className="text-gray-700 italic mb-4">"{review.comment}"</p>
            
            <div className="pt-3 border-t border-gray-50">
                <p className="text-xs text-blue-600 font-medium">
                  <i className="ri-hashtag mr-1"></i>
                  Product ID: {review.productId.substring(0, 10)}...
                </p>
            </div>
          </div>
        ))}

        {/* Add New Review Card - Matching Button Style */}
        <div
          onClick={() => navigate('/shop')}
          className="bg-blue-50 text-blue-600 flex flex-col items-center justify-center rounded-xl p-6 border-2 border-dashed border-blue-200 cursor-pointer hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 group"
        >
          <div className="bg-white p-3 rounded-full mb-2 group-hover:bg-blue-500 transition-colors">
             <i className="ri-add-line text-2xl"></i>
          </div>
          <p className="font-bold">Add New Review</p>
        </div>
      </div>

      {(!reviews || reviews.length === 0) && (
        <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100 mt-5">
           <i className="ri-chat-voice-line text-4xl text-gray-300"></i>
           <p className="text-gray-500 mt-2">No reviews given yet.</p>
        </div>
      )}
    </div>
  );
};

export default UserReviews;
