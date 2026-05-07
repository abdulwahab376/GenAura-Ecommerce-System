import React from "react";
import { useGetBundlesQuery } from "../redux/features/products/bundleApi";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const DealProducts = () => {
  const { data: bundles, isLoading, error } = useGetBundlesQuery();

  if (isLoading) return <div className="text-center py-10 font-black uppercase tracking-[4px] text-slate-300">Loading Hot Deals...</div>;
  if (error) return <div className="text-center py-10 text-red-500 font-bold">Failed to connect to API</div>;

  return (
    <section className="py-12 bg-white"> {/* Section padding kam ki */}
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section Compact */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mb-1">
            Exclusive Bundle Deals
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto mb-3"></div>
          <p className="text-gray-500 font-medium text-[12px] uppercase tracking-[2px]">
            Limited Time Offers — Handpicked for you
          </p>
        </div>

        {/* Bundle Grid with tighter gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles && bundles.length > 0 ? (
            bundles.map((deal) => {
              const allImages = deal.images && deal.images.length > 0 ? deal.images : [deal.image];

              return (
                <div key={deal._id} className="bg-white rounded-[20px] overflow-hidden shadow-xl shadow-slate-100 hover:shadow-indigo-50 transition-all duration-500 border border-slate-100 flex flex-col group">
                  
                  {/* Image Container - Height reduced to 64 (256px) */}
                  <div className="relative h-64 overflow-hidden bg-white">
                    <Swiper
                      modules={[Autoplay, Pagination, EffectFade]}
                      effect={'fade'}
                      autoplay={{ delay: 3000, disableOnInteraction: false }}
                      pagination={{ clickable: true }}
                      className="h-full w-full"
                    >
                      {allImages.map((img, idx) => (
                        <SwiperSlide key={idx} className="p-3">
                          <img 
                            src={img} 
                            className="w-full h-full object-contain" 
                            alt={`${deal.title}-${idx}`}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    
                    {/* RED BADGE - Adjusted position */}
                    <div className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md z-20">
                      {deal.badgeText || "HOT DEAL"}
                    </div>
                  </div>

                  {/* Content Box - Reduced padding from p-8 to p-5 */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div className="mb-4">
                      <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter mb-1 line-clamp-1">
                        {deal.title}
                      </h3>
                      <p className="text-gray-400 text-[12px] font-medium leading-snug line-clamp-2 italic">
                        {deal.description}
                      </p>
                    </div>
                    
                    <div>
                      {/* Price Section - Compact Padding */}
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl mb-4">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Bundle Price</span>
                          <span className="text-xl font-black text-red-600 tracking-tighter">Rs. {deal.dealPrice}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[12px] font-bold text-slate-300 line-through">Rs. {deal.originalPrice}</span>
                          <div className="text-[9px] font-black text-green-500 uppercase">Save Rs. {deal.originalPrice - deal.dealPrice}</div>
                        </div>
                      </div>

                      <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-black text-[11px] uppercase tracking-[1.5px] hover:bg-red-600 transition-all duration-300 active:scale-95 shadow-md">
                        Add Bundle To Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10 border-2 border-dashed border-slate-100 rounded-[30px]">
               <p className="text-slate-300 font-black uppercase tracking-[3px]">No deals found</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .swiper-pagination-bullet-active {
          background: #dc2626 !important;
          width: 15px !important;
          border-radius: 3px !important;
        }
        .swiper-pagination {
          bottom: 5px !important;
        }
      `}</style>
    </section>
  );
};

export default DealProducts;