// import React from 'react'
// import RatingStars from '../../components/RatingStars'
// import { Link } from 'react-router-dom'
// import { useDispatch } from 'react-redux';
// import { addToCart } from '../../redux/features/cart/cartSlice';
// import { toast } from 'react-hot-toast'; // 👈 Toast import kiya

// const ProductCards = ({ products }) => {
//     const dispatch = useDispatch();

//   const handleAddToCart = (product) => {
//     dispatch(addToCart(product));

//     toast.success(
//         (t) => (
//             <div className="flex items-center justify-between min-w-[250px]">
//                 <div className="flex flex-col">
//                     <span className="font-bold text-gray-800">{product?.name}</span>
//                     <span className="text-xs text-gray-500 italic">Added to your cart</span>
//                 </div>
                
//                 {/* Chota sa Cross button */}
//                 <button 
//                     onClick={() => toast.dismiss(t.id)}
//                     className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
//                 >
//                     <i className="ri-close-fill text-lg"></i>
//                 </button>
//             </div>
//         ),
//         {
//             // Default success icon (Green Tick) automatically yahan aa jayega
//             className: 'animate-slide-in', 
//         }
//     );
// };

//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//             {products && products.map((product, index) => {
//                 // ID handling: naya database connect karne ke baad _id hi use hogi
//                 const productId = product?._id || product?.id;

//                 return (
//                     <div key={productId || index} className="product__card">
//                         <div className='relative'>
//                             <Link to={`/shop/${productId}`}>
//                                 <img
//                                     src={product.image}
//                                     alt={product.name}
//                                     className='max-h-96 md:h-64 w-full object-cover hover:scale-105 transition-all duration-300'
//                                 />
//                             </Link>

//                             <div className='hover:block absolute top-3 right-3'>
//                                 <button
//                                     onClick={(e) => {
//                                         e.preventDefault(); // Link click ko rokne ke liye
//                                         e.stopPropagation();
//                                         handleAddToCart(product);
//                                     }}
//                                 >
//                                     <i className="ri-shopping-cart-2-line bg-primary p-1.5 text-white hover:bg-primary-dark rounded-full"></i>
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="product__card__content">
//                             <Link to={`/shop/${productId}`}>
//                                 <h4 className="hover:text-primary transition-colors cursor-pointer font-bold">
//                                     {product.name}
//                                 </h4>
//                             </Link>
//                             <p className="text-gray-600">
//                                 ${product.price} {product.oldPrice ? <s className="ml-2 text-red-400">${product.oldPrice}</s> : null}
//                             </p>
//                             <RatingStars rating={product.rating} />
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     )
// }

// export default ProductCards;


import React from 'react'
import RatingStars from '../../components/RatingStars'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { toast } from 'react-hot-toast';

const ProductCards = ({ products }) => {
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        toast.success(
            (t) => (
                <div className="flex items-center justify-between min-w-[200px]">
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">{product?.name}</span>
                        <span className="text-[10px] text-gray-500 italic">Added to cart</span>
                    </div>
                    <button onClick={() => toast.dismiss(t.id)} className="ml-2 text-gray-400 hover:text-red-500">
                        <i className="ri-close-fill"></i>
                    </button>
                </div>
            )
        );
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products && products.map((product, index) => {
                const productId = product?._id || product?.id;

                //  SAFE CHECK: Agar image array hai to index 0 uthao, warna direct string use karo
                const productImage = Array.isArray(product?.image) ? product.image[0] : product?.image;

                return (
                    <div key={productId || index} className="product__card flex flex-col h-full bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg border border-gray-100">
                        <div className='relative overflow-hidden rounded-t-lg bg-gray-50'>
                            <Link to={`/shop/${productId}`}>
                                <div className="h-48 sm:h-64 md:h-72 w-full flex items-center justify-center p-2">
                                    <img
                                        src={productImage} //  Ab ye sahi URL uthaye ga
                                        alt={product.name}
                                        className='max-w-full max-h-full object-contain hover:scale-105 transition-all duration-500'
                                    />
                                </div>
                            </Link>

                            <div className='absolute top-2 right-2'>
                                <button
                                    className="transform active:scale-90 transition-transform"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleAddToCart(product);
                                    }}
                                >
                                    <i className="ri-shopping-cart-2-line bg-primary/90 p-2 text-white hover:bg-black rounded-full shadow-md text-sm"></i>
                                </button>
                            </div>
                        </div>

                        <div className="product__card__content p-3 flex flex-col flex-grow text-center">
                            <Link to={`/shop/${productId}`}>
                                <h4 className="hover:text-primary transition-colors cursor-pointer font-semibold text-sm md:text-base mb-1 line-clamp-1">
                                    {product.name}
                                </h4>
                            </Link>
                            <p className="text-primary font-bold text-sm mb-1">
                                ${product.price} 
                                {product.oldPrice ? <s className="ml-2 text-[10px] text-gray-400 font-normal">${product.oldPrice}</s> : null}
                            </p>
                            <div className="mt-auto flex justify-center scale-75 md:scale-90">
                                <RatingStars rating={product.rating} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default ProductCards;