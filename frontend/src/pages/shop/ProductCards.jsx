import React from 'react'
import RatingStars from '../../components/RatingStars'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { toast } from 'react-hot-toast';
import { trackClick } from '../../utils/trackBehavior';

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
                const productImage = Array.isArray(product?.image) ? product.image[0] : product?.image;

                return (
                    <div key={productId || index} className="product__card flex flex-col h-full bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg border border-gray-100">
                        <div className='relative overflow-hidden rounded-t-lg bg-gray-50'>
                            <Link 
                                to={`/shop/${productId}`}
                                onClick={() => trackClick(product?.category)}
                            >
                                <div className="h-48 sm:h-64 md:h-72 w-full flex items-center justify-center p-2">
                                    <img
                                        src={productImage} 
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
                                        trackClick(product?.category);
                                    }}
                                >
                                    <i className="ri-shopping-cart-2-line bg-primary/90 p-2 text-white hover:bg-black rounded-full shadow-md text-sm"></i>
                                </button>
                            </div>
                        </div>

                        <div className="product__card__content p-3 flex flex-col flex-grow text-center">
                            <Link 
                                to={`/shop/${productId}`}
                                onClick={() => trackClick(product?.category)}
                            >
                                <h4 className="hover:text-primary transition-colors cursor-pointer font-semibold text-sm md:text-base mb-1 line-clamp-1">
                                    {product.name}
                                </h4>
                            </Link>
                            
                            <p className="text-red-600 font-extrabold text-base md:text-lg mb-1">
                                Rs. {product.price} 
                                {product.oldPrice ? (
                                    <s className="ml-2 text-[10px] text-gray-400 font-normal">
                                        Rs. {product.oldPrice}
                                    </s>
                                ) : null}
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