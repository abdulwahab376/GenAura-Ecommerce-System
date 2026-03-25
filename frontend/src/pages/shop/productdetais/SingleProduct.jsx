// import React, { useState, useEffect } from 'react';
// import { Link, useParams, useNavigate } from 'react-router-dom'; 
// import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
// import RatingStars from '../../../components/RatingStars';
// import { useDispatch } from 'react-redux';
// import { addToCart } from '../../../redux/features/cart/cartSlice';
// import ReviewsCard from '../reviews/ReviewsCard';
// import { toast } from 'react-hot-toast';

// const SingleProduct = () => {
//     const { id } = useParams();
//     const dispatch = useDispatch();
//     const navigate = useNavigate(); 

//     const { data, error, isLoading } = useFetchProductByIdQuery(id);
//     const singleProduct = data?.product || {};
//     const productReviews = data?.reviews || [];

//     const [activeImage, setActiveImage] = useState("");
//     const [selectedColor, setSelectedColor] = useState("");
//     const [selectedSize, setSelectedSize] = useState("");

//     useEffect(() => {
//         if (singleProduct?.image) {
//             const initialImage = Array.isArray(singleProduct.image) ? singleProduct.image[0] : singleProduct.image;
//             setActiveImage(initialImage);
//         }
//     }, [singleProduct]);

//     const handleAddToCart = (product, silent = false) => {
//         if (product?.color?.length > 0 && !selectedColor) {
//             toast.error("Please select a color first!");
//             return false;
//         }
//         if (product?.size?.length > 0 && !selectedSize) {
//             toast.error("Please select a size first!");
//             return false;
//         }

//         dispatch(addToCart({ 
//             ...product, 
//             selectedColor, 
//             selectedSize 
//         }));

//         if (!silent) {
//             toast.success(`${product?.name} added to cart!`);
//         }
//         return true;
//     };

//     const handleBuyNow = (product) => {
//         const success = handleAddToCart(product, true); 
//         if (success) {
//             navigate("/checkout"); 
//         }
//     };

//     if (isLoading) return <div className="p-10 text-center text-primary font-bold">Loading product details...</div>;
//     if (error) return <div className="p-10 text-center text-red-500 font-bold">Error loading product details.</div>;

//     return (
//         <>
//             <section className="section__container rounded bg-primary-light">
//                 <h2 className="section__header text-2xl mb-2">Product Details</h2>
//                 <div className="section__subheader space-x-2 flex items-center">
//                     <span className='hover:text-primary transition-colors'><Link to="/">Home</Link></span>
//                     <i className="ri-arrow-right-s-line"></i>
//                     <span className='hover:text-primary transition-colors'><Link to="/shop">Shop</Link></span>
//                     <i className="ri-arrow-right-s-line"></i>
//                     <span className='font-semibold text-primary truncate max-w-[200px]'>{singleProduct?.name}</span>
//                 </div>
//             </section>

//             <section className="section__container mt-10">
//                 <div className="flex flex-col items-start md:flex-row gap-12">
//                     <div className="w-full md:w-2/5">
//                         <div className="flex justify-center items-center bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100 mb-4 h-[400px] md:h-[500px]">
//                             <img src={activeImage} alt={singleProduct?.name} className="rounded-lg max-w-full max-h-full object-contain shadow-md hover:scale-105 transition-transform duration-500" />
//                         </div>
//                         {Array.isArray(singleProduct?.image) && singleProduct.image.length > 1 && (
//                             <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
//                                 {singleProduct.image.map((img, index) => (
//                                     <div key={index} onClick={() => setActiveImage(img)} className={`w-20 h-20 flex-shrink-0 cursor-pointer rounded-lg border-2 overflow-hidden bg-white ${activeImage === img ? 'border-primary shadow-lg scale-105' : 'border-gray-200 opacity-70'}`}>
//                                         <img src={img} alt={`view-${index}`} className="w-full h-full object-contain" />
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     <div className="w-full md:w-3/5">
//                         <h3 className="text-3xl font-black mb-2 text-gray-900 leading-tight">{singleProduct?.name}</h3>
//                         <div className="flex items-center gap-3 mb-4">
//                             <RatingStars rating={singleProduct?.rating || 0} />
//                             <span className="text-sm text-gray-500 font-medium">({productReviews.length} reviews)</span>
//                         </div>
                        
//                         <div className="flex items-center gap-4 mb-6">
//                             <span className="text-3xl font-black text-primary">${singleProduct?.price}</span>
//                         </div>

//                         {singleProduct?.color?.length > 0 && (
//                             <div className="mb-6">
//                                 <h4 className="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-widest">Available Colors</h4>
//                                 <div className="flex gap-2 flex-wrap">
//                                     {singleProduct.color.map((c, i) => (
//                                         <button 
//                                             key={i} 
//                                             onClick={() => setSelectedColor(c)}
//                                             className={`px-3 py-1.5 border rounded-full text-xs capitalize transition-all ${selectedColor === c ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-600 border-gray-300 hover:border-primary'}`}
//                                         >
//                                             {c}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         {singleProduct?.size?.length > 0 && (
//                             <div className="mb-6">
//                                 <h4 className="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-widest">Select Size</h4>
//                                 <div className="flex gap-2 flex-wrap">
//                                     {singleProduct.size.map((s, i) => (
//                                         <button 
//                                             key={i} 
//                                             onClick={() => setSelectedSize(s)}
//                                             className={`w-9 h-9 flex items-center justify-center border rounded-md text-xs font-bold transition-all ${selectedSize === s ? 'bg-black text-white border-black shadow-lg scale-105' : 'bg-white text-gray-600 border-gray-300 hover:border-black'}`}
//                                         >
//                                             {s}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         <div className="border-t border-b py-4 my-6">
//                             <h4 className="font-bold text-gray-800 mb-1 uppercase text-xs tracking-widest">Description</h4>
//                             {/* ✅ FIXED: whitespace-pre-line added here */}
//                             <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
//                                 {singleProduct?.description}
//                             </p>
//                         </div>

//                         <div className="flex flex-wrap gap-4 mt-8">
//                             <button
//                                 onClick={() => handleAddToCart(singleProduct)}
//                                 className="flex-1 md:flex-none px-8 py-3 bg-white border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
//                             >
//                                 <i className="ri-shopping-cart-line"></i>
//                                 Add to Cart
//                             </button>

//                             <button
//                                 onClick={() => handleBuyNow(singleProduct)}
//                                 className="flex-1 md:flex-none px-10 py-3 bg-primary text-white font-bold rounded-lg hover:bg-black hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
//                             >
//                                 <i className="ri-flashlight-fill"></i>
//                                 Buy Now
//                             </button>
//                         </div>
                        
//                         {((singleProduct?.color?.length > 0 && !selectedColor) || (singleProduct?.size?.length > 0 && !selectedSize)) && (
//                             <p className="mt-3 text-red-500 text-[10px] font-bold animate-pulse uppercase tracking-tighter">* Please select color and size to proceed</p>
//                         )}
//                     </div>
//                 </div>
//             </section>

//             <section className="section__container mt-16 border-t pt-10">
//                 <div className="mb-8">
//                     <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Customer Reviews</h3>
//                     <p className="text-gray-500">Real feedback from our Lebaba community</p>
//                 </div>
//                 <ReviewsCard productReviews={productReviews}/>
//             </section>
//         </>
//     );
// };

// export default SingleProduct;



import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'; 
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import RatingStars from '../../../components/RatingStars';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';
import { toast } from 'react-hot-toast';

const SingleProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    const { data, error, isLoading } = useFetchProductByIdQuery(id);
    const singleProduct = data?.product || {};
    const productReviews = data?.reviews || [];

    const [activeImage, setActiveImage] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");

    useEffect(() => {
        if (singleProduct?.image) {
            const initialImage = Array.isArray(singleProduct.image) ? singleProduct.image[0] : singleProduct.image;
            setActiveImage(initialImage);
        }
    }, [singleProduct]);

    const handleAddToCart = (product, silent = false) => {
        if (product?.color?.length > 0 && !selectedColor) {
            toast.error("Please select a color first!");
            return false;
        }
        if (product?.size?.length > 0 && !selectedSize) {
            toast.error("Please select a size first!");
            return false;
        }

        dispatch(addToCart({ 
            ...product, 
            selectedColor, 
            selectedSize 
        }));

        if (!silent) {
            toast.success(`${product?.name} added to cart!`);
        }
        return true;
    };

    const handleBuyNow = (product) => {
        const success = handleAddToCart(product, true); 
        if (success) {
            navigate("/checkout"); 
        }
    };

    if (isLoading) return <div className="p-10 text-center text-primary font-bold">Loading product details...</div>;
    if (error) return <div className="p-10 text-center text-red-500 font-bold">Error loading product details.</div>;

    return (
        <>
            <section className="section__container rounded bg-primary-light">
                <h2 className="section__header text-2xl mb-2">Product Details</h2>
                <div className="section__subheader space-x-2 flex items-center">
                    <span className='hover:text-primary transition-colors'><Link to="/">Home</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-primary transition-colors'><Link to="/shop">Shop</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='font-semibold text-primary truncate max-w-[200px]'>{singleProduct?.name}</span>
                </div>
            </section>

            <section className="section__container mt-10">
                <div className="flex flex-col items-start md:flex-row gap-12">
                    <div className="w-full md:w-2/5">
                        <div className="flex justify-center items-center bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100 mb-4 h-[400px] md:h-[500px]">
                            <img src={activeImage} alt={singleProduct?.name} className="rounded-lg max-w-full max-h-full object-contain shadow-md hover:scale-105 transition-transform duration-500" />
                        </div>
                        {Array.isArray(singleProduct?.image) && singleProduct.image.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
                                {singleProduct.image.map((img, index) => (
                                    <div key={index} onClick={() => setActiveImage(img)} className={`w-20 h-20 flex-shrink-0 cursor-pointer rounded-lg border-2 overflow-hidden bg-white ${activeImage === img ? 'border-primary shadow-lg scale-105' : 'border-gray-200 opacity-70'}`}>
                                        <img src={img} alt={`view-${index}`} className="w-full h-full object-contain" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-3/5">
                        <h3 className="text-3xl font-black mb-2 text-gray-900 leading-tight">{singleProduct?.name}</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <RatingStars rating={singleProduct?.rating || 0} />
                            <span className="text-sm text-gray-500 font-medium">({productReviews.length} reviews)</span>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-6">
                            {/* ✅ UPDATED: Changed $ to Rs. */}
                            <span className="text-3xl font-black text-primary">Rs. {singleProduct?.price}</span>
                        </div>

                        {singleProduct?.color?.length > 0 && (
                            <div className="mb-6">
                                <h4 className="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-widest">Available Colors</h4>
                                <div className="flex gap-2 flex-wrap">
                                    {singleProduct.color.map((c, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => setSelectedColor(c)}
                                            className={`px-3 py-1.5 border rounded-full text-xs capitalize transition-all ${selectedColor === c ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-600 border-gray-300 hover:border-primary'}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {singleProduct?.size?.length > 0 && (
                            <div className="mb-6">
                                <h4 className="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-widest">Select Size</h4>
                                <div className="flex gap-2 flex-wrap">
                                    {singleProduct.size.map((s, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => setSelectedSize(s)}
                                            className={`w-9 h-9 flex items-center justify-center border rounded-md text-xs font-bold transition-all ${selectedSize === s ? 'bg-black text-white border-black shadow-lg scale-105' : 'bg-white text-gray-600 border-gray-300 hover:border-black'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="border-t border-b py-4 my-6">
                            <h4 className="font-bold text-gray-800 mb-1 uppercase text-xs tracking-widest">Description</h4>
                            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                                {singleProduct?.description}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <button
                                onClick={() => handleAddToCart(singleProduct)}
                                className="flex-1 md:flex-none px-8 py-3 bg-white border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                            >
                                <i className="ri-shopping-cart-line"></i>
                                Add to Cart
                            </button>

                            <button
                                onClick={() => handleBuyNow(singleProduct)}
                                className="flex-1 md:flex-none px-10 py-3 bg-primary text-white font-bold rounded-lg hover:bg-black hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                            >
                                <i className="ri-flashlight-fill"></i>
                                Buy Now
                            </button>
                        </div>
                        
                        {((singleProduct?.color?.length > 0 && !selectedColor) || (singleProduct?.size?.length > 0 && !selectedSize)) && (
                            <p className="mt-3 text-red-500 text-[10px] font-bold animate-pulse uppercase tracking-tighter">* Please select color and size to proceed</p>
                        )}
                    </div>
                </div>
            </section>

            <section className="section__container mt-16 border-t pt-10">
                <div className="mb-8">
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Customer Reviews</h3>
                    <p className="text-gray-500">Real feedback from our Lebaba community</p>
                </div>
                <ReviewsCard productReviews={productReviews}/>
            </section>
        </>
    );
};

export default SingleProduct;