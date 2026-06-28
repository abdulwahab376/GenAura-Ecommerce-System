import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../redux/features/cart/cartSlice"; 
import { useNavigate } from "react-router-dom";

//  Props mein onClose receive kar rahe hain jo CartModal se aa raha hai
const OrderSummary = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { grandTotal, totalPrice, selectedItems } =
    useSelector((store) => store.cart);

 
  const shippingFee = 200.00; 
  const finalGrandTotal = totalPrice + shippingFee;

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
        <h1 className="text-2xl font-bold text-dark border-b pb-2">Order Summary</h1>
        
        <div className="space-y-2">
          <p className="text-dark flex justify-between">
            <span>Selected Items:</span> 
            <span className="font-semibold">{selectedItems}</span>
          </p>
          
          <p className="text-dark flex justify-between">
            <span>Subtotal:</span>
            <span className="font-semibold">Rs. {totalPrice.toLocaleString()}</span>
          </p>

          {/*  Tax hatakar Shipping Fee dal di */}
          <p className="text-indigo-600 flex justify-between">
            <span>Shipping Fee:</span>
            <span className="font-semibold">Rs. {shippingFee.toLocaleString()}</span>
          </p>
        </div>

        <h3 className="font-bold text-dark mt-4 text-xl border-t pt-3 flex justify-between">
          <span>Total:</span>
          <span className="text-indigo-600">Rs. {finalGrandTotal.toLocaleString()}</span>
        </h3>
      </div>

      <div className="px-4 pb-6 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClearCart();
          }}
          className="bg-red-500 px-3 py-2 text-white mt-2 rounded-md flex justify-between items-center mb-4 w-full hover:bg-red-600 transition-all font-medium"
        >
          <span className="mr-2">Clear Cart</span>
          <i className="ri-delete-bin-7-line"></i>
        </button>

        <button
          onClick={handleProceedToCheckout} 
          className="bg-indigo-600 px-3 py-2 text-white mt-2 rounded-md flex justify-between items-center w-full hover:bg-indigo-700 transition-all font-medium shadow-md"
        >
          <span className="mr-2">Proceed to Checkout</span>
          <i className="ri-arrow-right-line"></i>
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;