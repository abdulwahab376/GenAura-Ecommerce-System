import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetBundleByIdQuery } from '../../../redux/features/products/bundleApi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/features/cart/cartSlice';
import { toast } from 'react-hot-toast';
import { ShoppingBag, ChevronRight, ShieldCheck, Flame } from 'lucide-react'; 

const SingleBundle = () => {
    const { id } = useParams();
    const { data: bundle, isLoading, error } = useGetBundleByIdQuery(id);
    const dispatch = useDispatch();
    
    const [mainImage, setMainImage] = useState(null);

    const handleAddToCart = () => {
        const cartProduct = {
            _id: bundle._id,
            // 🚀 'title' ko 'name' kar diya taake cart mein naam show ho
            name: bundle.title, 
            price: bundle.dealPrice,
            image: bundle.image,
            quantity: 1,
            type: 'bundle'
        };
        dispatch(addToCart(cartProduct));
        toast.success(`${bundle.title} added to cart!`, {
            style: { background: '#1f2937', color: '#fff' }
        });
    };

    if (isLoading) return <div className="py-20 text-center font-black uppercase tracking-widest text-slate-300 animate-pulse">Loading Exclusive Deal...</div>;
    if (error) return <div className="py-20 text-center text-red-500 font-bold">Oops! Deal not found.</div>;

    const displayImage = mainImage || bundle.image;

    return (
        <section className="bg-white min-h-screen">
            {/* 🚀 PINK HERO BANNER SECTION */}
            <div className="bg-[#fdf2f8] py-16 md:py-24 text-center">
                <h2 className="text-3xl md:text-4xl font-black text-[#1e1b4b] mb-4 uppercase tracking-tighter">
                    Exclusive Bundle Details
                </h2>
                <div className="flex items-center justify-center gap-2 text-[11px] md:text-xs font-bold uppercase tracking-widest">
                    <Link to="/" className="text-slate-400 hover:text-red-600 transition-colors">Home</Link>
                    <ChevronRight size={14} className="text-slate-300" />
                    <Link to="/shop" className="text-slate-400 hover:text-red-600 transition-colors">Shop</Link>
                    <ChevronRight size={14} className="text-slate-300" />
                    <span className="text-red-600 truncate max-w-[200px]">{bundle.title}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    
                    {/* Left: Images Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-slate-50 rounded-[30px] overflow-hidden border border-slate-100 p-8 shadow-inner">
                            <img 
                                src={displayImage} 
                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-700" 
                                alt={bundle.title} 
                            />
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4">
                            {bundle.images?.map((img, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => setMainImage(img)}
                                    className={`aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all p-2 bg-slate-50 ${displayImage === img ? 'border-red-600 scale-95 shadow-lg' : 'border-transparent hover:border-slate-200'}`}
                                >
                                    <img src={img} className="w-full h-full object-contain" alt={`preview-${i}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Content Section */}
                    <div className="flex flex-col text-left">
                        {/* 🚀 HOT DEAL BADGE (No stars here) */}
                        <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[2px] mb-6 w-fit shadow-lg shadow-red-100">
                            <Flame size={14} fill="currentColor" />
                            {bundle.badgeText || "HOT DEAL"}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-4">
                            {bundle.title}
                        </h1>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bundle Price</span>
                                <span className="text-4xl font-black text-red-600 tracking-tighter">Rs. {bundle.dealPrice}</span>
                            </div>
                            <div className="h-10 w-[1px] bg-slate-200"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider line-through decoration-slate-300">Rs. {bundle.originalPrice}</span>
                                <span className="text-sm font-black text-green-500 uppercase">Save {Math.round(((bundle.originalPrice - bundle.dealPrice) / bundle.originalPrice) * 100)}% Off</span>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-8">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-3 underline decoration-red-500 underline-offset-4">What's inside this bundle:</h4>
                            <p className="text-slate-500 text-sm leading-relaxed italic font-medium">
                                {bundle.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                                <ShieldCheck className="text-green-500" size={24} />
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Original Quality Guaranteed</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                                <ShoppingBag className="text-blue-500" size={24} />
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Fast Island-wide Delivery</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleAddToCart}
                            className="w-full bg-slate-900 text-white py-5 rounded-[20px] font-black uppercase tracking-[3px] text-xs hover:bg-red-600 transition-all duration-500 shadow-2xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-3"
                        >
                            <ShoppingBag size={18} />
                            Add This Bundle To Cart
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default SingleBundle;