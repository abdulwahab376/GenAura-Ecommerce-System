// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { clearCart } from "../../redux/features/cart/cartSlice";

// const OrderSummary = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);

//   const products = useSelector((store) => store.cart.products);
//   const { tax, taxRate, grandTotal, totalPrice, selectedItems } =
//     useSelector((store) => store.cart);

//   const handleClearCart = () => {
//     dispatch(clearCart());
//   };

//   // Cash on Delivery Order
// const placeOrder = async () => {
//   try {

//     const formattedProducts = products.map((product) => ({
//       productId: product._id,
//       name: product.name,
//       image: product.image,
//       price: product.price,
//       quantity: product.quantity
//     }));

//     const body = {
//       userId: user?._id,
//       email: user?.email,   //  FIX
//       products: formattedProducts,  //  FIX
//       totalAmount: grandTotal,
//       paymentMethod: "Cash on Delivery"
//     };

//     const response = await fetch(
//       "http://localhost:5000/api/orders/create-order",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(body)
//       }
//     );

//     const data = await response.json();
//     console.log("Order placed:", data);

//     alert("Order placed successfully! Payment will be Cash on Delivery.");

//     dispatch(clearCart());

//   } catch (error) {
//     console.error("Order error:", error);
//   }
// };

//   return (
//     <div className="bg-primary-light mt-5 rounded text-base">
//       <div className="px-6 py-4 space-y-5">
//         <h1 className="text-2xl font-bold text-dark">Order Summary</h1>

//         <p className="text-dark mt-2">
//           Selected Items : {selectedItems}
//         </p>

//         <p className="text-dark mt-2">
//           Total Price : ${totalPrice.toFixed(2)}
//         </p>

//         <p className="text-dark mt-2">
//           Tax ({taxRate * 100}%): ${tax.toFixed(2)}
//         </p>

//         <h3 className="font-semibold text-dark mt-4">
//           Grand Total ${grandTotal.toFixed(2)}
//         </h3>
//       </div>

//       <div className="px-4 pb-6">
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             handleClearCart();
//           }}
//           className="bg-red-500 px-3 py-1.5 text-white mt-2 rounded-md flex justify-between items-center mb-4"
//         >
//           <span className="mr-2">Clear Cart</span>
//           <i className="ri-delete-bin-7-line"></i>
//         </button>

//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             placeOrder();
//           }}
//           className="bg-green-600 px-3 py-1.5 text-white mt-2 rounded-md flex justify-between items-center"
//         >
//           <span className="mr-2">Place Order (Cash on Delivery)</span>
//           <i className="ri-truck-line"></i>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderSummary;



import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../redux/features/cart/cartSlice"; 
import { useNavigate } from "react-router-dom";

//  Props mein onClose receive kar rahe hain jo CartModal se aa raha hai
const OrderSummary = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { tax, taxRate, grandTotal, totalPrice, selectedItems } =
    useSelector((store) => store.cart);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleProceedToCheckout = (e) => {
    e.stopPropagation();

    //  1. Pehle Cart Sidebar ko band karo
    if (onClose) {
        onClose(); 
    }

    //  2. Phir Checkout page par navigate karo
    navigate("/checkout");   
  };

  return (
    <div className="bg-primary-light mt-5 rounded text-base">
      <div className="px-6 py-4 space-y-5">
        <h1 className="text-2xl font-bold text-dark">Order Summary</h1>
        <p className="text-dark mt-2">Selected Items : {selectedItems}</p>
        <p className="text-dark mt-2">Total Price : ${totalPrice.toFixed(2)}</p>
        <p className="text-dark mt-2">Tax ({taxRate * 100}%): ${tax.toFixed(2)}</p>
        <h3 className="font-semibold text-dark mt-4">Grand Total ${grandTotal.toFixed(2)}</h3>
      </div>

      <div className="px-4 pb-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClearCart();
          }}
          className="bg-red-500 px-3 py-1.5 text-white mt-2 rounded-md flex justify-between items-center mb-4 w-full hover:bg-red-600 transition-all"
        >
          <span className="mr-2">Clear Cart</span>
          <i className="ri-delete-bin-7-line"></i>
        </button>

        <button
          onClick={handleProceedToCheckout} 
          className="bg-indigo-600 px-3 py-1.5 text-white mt-2 rounded-md flex justify-between items-center w-full hover:bg-indigo-700 transition-all"
        >
          <span className="mr-2">Proceed to Checkout</span>
          <i className="ri-arrow-right-line"></i>
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;