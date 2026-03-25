// import React from 'react';
// import { useDispatch } from 'react-redux';
// import OrderSummary from './OrderSummary';
// import { removeFromCart, updateQuantity } from '../../redux/features/cart/cartSlice';

// const CartModal = ({ isOpen, onClose, products }) => {
//     const dispatch = useDispatch();

//     // Quantity handle karne ke liye (Increment/Decrement)
//     const handleQuantity = (type, id) => {
//         const payload = { type, id };
//         dispatch(updateQuantity(payload));
//     };

//     // Product remove karne ke liye
//     const handleRemove = (e, id) => {
//         e.preventDefault();
//         dispatch(removeFromCart({ id }));
//     };

//     return (
//         <div
//             className={`fixed z-[1000] inset-0 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
//             style={{ transition: 'opacity 300ms' }}
//         >
//             <div
//                 className={`fixed right-0 top-0 md:w-1/3 w-full bg-white h-full shadow-2xl overflow-y-auto transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} 
//                 style={{ transition: 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
//             >
//                 <div className="p-4 mt-4">
//                     {/* Header Section */}
//                     <div className="flex justify-between items-center mb-4 border-b pb-4">
//                         <h4 className="text-xl font-semibold">Your Cart</h4>
//                         <button
//                             onClick={() => onClose()} // Manual close button
//                             className="text-gray-600 hover:text-gray-900"
//                         >
//                             <i className="ri-close-line bg-black p-1 text-white rounded"></i>
//                         </button>
//                     </div>

//                     {/* Cart Items List */}
//                     <div className="cart-items">
//                         {products.length === 0 ? (
//                             <div className="text-center py-10">
//                                 <p className="text-gray-500">Your cart is empty.</p>
//                             </div>
//                         ) : (
//                             products.map((item, index) => (
//                                 <div key={index} className="flex flex-col md:flex-row md:items-center md:justify-between shadow-sm border rounded-lg md:p-4 p-2 mb-4">
//                                     <div className='flex items-center'>
//                                         <span className='mr-4 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full'>
//                                             {index + 1}
//                                         </span>
//                                         <img src={item.image} alt={item.name} className="size-14 object-cover rounded mr-4" />
//                                         <div>
//                                             <h5 className="text-md font-medium text-dark">{item.name}</h5>
//                                             <p className="text-gray-600 text-sm">${Number(item.price).toFixed(2)}</p>
//                                         </div>
//                                     </div>

//                                     {/* Quantity and Remove Section */}
//                                     <div className="flex flex-row md:justify-start justify-between items-center mt-3 md:mt-0">
//                                         <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
//                                             <button
//                                                 onClick={() => handleQuantity("decrement", item._id)}
//                                                 className="size-6 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-700 hover:bg-red-500 hover:text-white transition-all"
//                                             >
//                                                 -
//                                             </button>
//                                             <span className="px-3 font-semibold">{item.quantity}</span>
//                                             <button
//                                                 onClick={() => handleQuantity("increment", item._id)}
//                                                 className="size-6 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-700 hover:bg-green-500 hover:text-white transition-all"
//                                             >
//                                                 +
//                                             </button>
//                                         </div>
                                        
//                                         <button
//                                             onClick={(e) => handleRemove(e, item._id)}
//                                             className="text-red-500 text-sm font-medium hover:underline ml-4"
//                                         >
//                                             Remove
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                     </div>

//                     {/* Order Summary Section */}
//                     {products.length > 0 && (
//                         /*  Yahan humne onClose pass kar diya hai taake 
//                            OrderSummary ke andar Proceed to Checkout dabate hi 
//                            yeh pura Modal band ho jaye */
//                         <OrderSummary onClose={onClose} />
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CartModal;



import React from 'react';
import { useDispatch } from 'react-redux';
import OrderSummary from './OrderSummary';
import { removeFromCart, updateQuantity } from '../../redux/features/cart/cartSlice';

const CartModal = ({ isOpen, onClose, products }) => {
    const dispatch = useDispatch();

    // Quantity handle karne ke liye (Increment/Decrement)
    const handleQuantity = (type, id) => {
        const payload = { type, id };
        dispatch(updateQuantity(payload));
    };

    // Product remove karne ke liye
    const handleRemove = (e, id) => {
        e.preventDefault();
        dispatch(removeFromCart({ id }));
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
                        <h4 className="text-xl font-semibold">Your Cart</h4>
                        <button
                            onClick={() => onClose()} // Manual close button
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <i className="ri-close-line bg-black p-1 text-white rounded"></i>
                        </button>
                    </div>

                    {/* Cart Items List */}
                    <div className="cart-items">
                        {products.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-500">Your cart is empty.</p>
                            </div>
                        ) : (
                            products.map((item, index) => {
                                //  FUNCTIONAL FIX: Agar image array hai to 1st index dikhao, warna direct string
                                const displayImg = Array.isArray(item.image) ? item.image[0] : item.image;

                                return (
                                    <div key={index} className="flex flex-col md:flex-row md:items-center md:justify-between shadow-sm border rounded-lg md:p-4 p-2 mb-4">
                                        <div className='flex items-center'>
                                            <span className='mr-4 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full'>
                                                {index + 1}
                                            </span>
                                            {/*  displayImg variable yahan use ho raha hai */}
                                            <img src={displayImg} alt={item.name} className="size-14 object-cover rounded mr-4" />
                                            <div>
                                                <h5 className="text-md font-medium text-dark">{item.name}</h5>
                                                <p className="text-gray-600 text-sm">${Number(item.price).toFixed(2)}</p>
                                            </div>
                                        </div>

                                        {/* Quantity and Remove Section */}
                                        <div className="flex flex-row md:justify-start justify-between items-center mt-3 md:mt-0">
                                            <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                                                <button
                                                    onClick={() => handleQuantity("decrement", item._id)}
                                                    className="size-6 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-700 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    -
                                                </button>
                                                <span className="px-3 font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantity("increment", item._id)}
                                                    className="size-6 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-700 hover:bg-green-500 hover:text-white transition-all"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            
                                            <button
                                                onClick={(e) => handleRemove(e, item._id)}
                                                className="text-red-500 text-sm font-medium hover:underline ml-4"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Order Summary Section */}
                    {products.length > 0 && (
                        <OrderSummary onClose={onClose} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartModal;
