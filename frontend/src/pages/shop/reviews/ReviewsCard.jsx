import React, { useState } from 'react';
import CommentorIcon from "../../../assets/avatar.png";
import { formatDate } from '../../../utils/dateFormater';
import PostAReview from './PostAReview';
import RatingStars from '../../../components/RatingStars';

const ReviewsCard = ({ productReviews }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenReviewModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setIsModalOpen(false);
    };

    const reviews = productReviews || [];

    return (
        <div className="my-2 bg-white px-4 py-6 md:p-8 rounded-xl shadow-sm border border-gray-50">
            <div>
                {reviews.length > 0 ? (
                    <div className="space-y-8">
                        {/* <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                            <i className="ri-chat-3-line text-primary"></i>
                            Community Feedback ({reviews.length})
                        </h3> */}
                        
                        <div className="space-y-6">
                            {reviews.map((review, index) => (
                                <div key={index} className="group transition-all duration-300">
                                    <div className="flex gap-4 items-start">
                                        {/* Avatar Styling */}
                                        <div className="relative">
                                            <img 
                                                src={CommentorIcon} 
                                                alt="user" 
                                                className="h-12 w-12 md:h-14 md:w-14 rounded-full border-2 border-gray-100 p-0.5 object-cover shadow-sm group-hover:border-primary transition-colors" 
                                            />
                                            <div className="absolute -bottom-1 -right-1 bg-green-500 h-3.5 w-3.5 rounded-full border-2 border-white"></div>
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                                <div>
                                                    <p className="text-base font-black text-gray-800 capitalize leading-none mb-1">
                                                        {review?.userId?.username || "Verified Customer"}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <RatingStars rating={review?.rating}/>
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">
                                                            {formatDate(review?.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Comment Bubble Style */}
                                            <div className="relative bg-gray-50/50 p-4 rounded-2xl rounded-tl-none border border-gray-100 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                                                <p className="text-gray-600 text-sm leading-relaxed italic">
                                                    "{review?.comment}"
                                                </p>
                                                {/* Decorative Quote Icon */}
                                                <i className="ri-double-quotes-r absolute bottom-2 right-4 text-gray-200 text-xl"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <i className="ri-discuss-line text-4xl text-gray-300 mb-2 block"></i>
                        <p className="text-gray-500 font-medium italic">No reviews yet. Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>

            {/* Add comment button - Pro Look */}
            <div className='mt-10 flex justify-center md:justify-start'>
                <button
                    onClick={handleOpenReviewModal}
                    className="group relative px-8 py-3.5 bg-gray-900 text-white rounded-full overflow-hidden transition-all hover:bg-primary hover:shadow-xl hover:shadow-primary/20 active:scale-95"
                >
                    <span className="relative z-10 flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                        <i className="ri-edit-2-fill text-sm"></i> Write A Review
                    </span>
                </button>
            </div>

            {/* PostAReview Modal */}
            <PostAReview
                isModalOpen={isModalOpen}
                handleClose={handleCloseReviewModal}
            />
        </div>
    );
};

export default ReviewsCard;