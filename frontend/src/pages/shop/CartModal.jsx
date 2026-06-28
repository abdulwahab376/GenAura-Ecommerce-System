import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; 
import OrderSummary from './OrderSummary';
import { removeFromCart, updateQuantity, toggleCart } from '../../redux/features/cart/cartSlice'; // 🚀 toggleCart import kiya

const CartModal = ({ products }) => { 
    const dispatch = useDispatch();
    
    // Ab ye state direct Redux se uthaye ga (Voice Search yahi update karta hai)
    const isOpen = useSelector((state) => state.cart.isOpen);

    const handleQuantity = (type, id) => {
        const payload = { type, id };
        dispatch(updateQuantity(payload));
    };

    const handleRemove = (e, id) => {
        e.preventDefault();
        dispatch(removeFromCart({ id }));
    };

    // Close karne ke liye Redux action
    const handleClose = () => {
        dispatch(toggleCart());
    };

    return (
        <div
            className={`fixed z-[1000] inset-0 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ transition: 'opacity 300ms' }}
        >
            <div
                className={`fixed right-0 top-0 md:w-1/3 w-full bg-white h-full shadow-2xl overflow-y-auto transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} 
                style={{ transition: 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
            >
                <div className="p-4 mt-4">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                        <h4 className="text-xl font-semibold text-dark uppercase tracking-tight">Shopping Cart</h4>
                        <button
                            onClick={handleClose} 
                            className="text-gray-600 hover:text-gray-900 transition-transform active:scale-90"
                        >
                            <i className="ri-close-line bg-black p-1 text-white rounded"></i>
                        </button>
                    </div>

                    {/* Cart Items List */}
                    <div className="cart-items">
                        {products.length === 0 ? (
                            <div className="text-center py-20">
                                <i className="ri-shopping-cart-2-line text-5xl text-gray-300"></i>
                                <p className="text-gray-500 mt-4 font-medium">Your cart is empty.</p>
                                <button 
                                    onClick={handleClose} // ✅ Updated
                                    className="mt-4 text-indigo-600 font-semibold hover:underline"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            products.map((item, index) => {
                                const displayImg = Array.isArray(item.image) ? item.image[0] : item.image;
                                const itemTotalPrice = Number(item.price) * item.quantity;

                                return (
                                    <div key={index} className="flex flex-col md:flex-row md:items-center md:justify-between shadow-sm border border-gray-100 rounded-xl md:p-4 p-3 mb-4 bg-white hover:shadow-md transition-shadow">
                                        <div className='flex items-center flex-1'>
                                            <span className='mr-3 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full'>
                                                {index + 1}
                                            </span>
                                            <img src={displayImg} alt={item.name} className="size-16 object-cover rounded-lg mr-4 border border-gray-50" />
                                            <div className="flex-1">
                                                <h5 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h5>
                                                <div className="flex flex-col mt-1">
                                                    <span className="text-indigo-600 font-bold text-sm">
                                                        Rs. {itemTotalPrice.toLocaleString()}
                                                    </span>
                                                    <span className="text-gray-400 text-[10px]">
                                                        Unit Price: Rs. {Number(item.price).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between mt-3 md:mt-0 gap-3">
                                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1">
                                                <button
                                                    onClick={() => handleQuantity("decrement", item._id)}
                                                    className="size-7 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all border border-gray-100"
                                                >
                                                    <i className="ri-subtract-line text-xs"></i>
                                                </button>
                                                <span className="px-3 font-bold text-sm text-gray-800 min-w-[30px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantity("increment", item._id)}
                                                    className="size-7 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all border border-gray-100"
                                                >
                                                    <i className="ri-add-line text-xs"></i>
                                                </button>
                                            </div>
                                            <button
                                                onClick={(e) => handleRemove(e, item._id)}
                                                className="text-red-400 text-[11px] font-bold hover:text-red-600 uppercase tracking-tighter transition-colors"
                                            >
                                                Remove Item
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Order Summary Section */}
                    {products.length > 0 && (
                        <div className="mt-8 border-t pt-2">
                             <OrderSummary onClose={handleClose} /> {/* ✅ Pass Redux close */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartModal;