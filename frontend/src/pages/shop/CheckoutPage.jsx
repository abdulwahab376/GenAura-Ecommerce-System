import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/features/cart/cartSlice';
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { user } = useSelector((state) => state.auth);
    const { products, totalPrice } = useSelector((store) => store.cart);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: user?.email || '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Pakistan', 
        phone: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [isProcessing, setIsProcessing] = useState(false);

    // ✅ Tax khatam aur Shipping Fee Rs. 200 set kar di
    const shippingFee = 200.00; 
    const finalAmount = totalPrice + shippingFee;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFinalOrder = async (e) => {
        e.preventDefault();
        
        if (products.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        setIsProcessing(true);
        
        const body = {
            userId: user?._id || "guest",
            email: formData.email,
            products: products.map(p => ({
                productId: p._id,
                name: p.name,
                image: Array.isArray(p.image) ? p.image[0] : p.image,
                price: p.price,
                quantity: p.quantity
            })),
            amount: finalAmount, 
            address: { ...formData },
            phone: formData.phone,
            paymentMethod: paymentMethod === 'MANUAL' ? "Manual Payment (EasyPaisa/JazzCash/Bank)" : "Cash on Delivery"
        };

        try {
            const response = await fetch("http://localhost:5000/api/orders/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Order placed successfully!", { duration: 3000 });
                dispatch(clearCart());
                
                if (paymentMethod === 'MANUAL') {
                    navigate('/payment-chat', { 
                        state: { 
                            amount: finalAmount, 
                            orderId: result.order._id 
                        } 
                    });
                } else {
                    navigate("/dashboard/orders");
                }
            } else {
                toast.error(result.message || "Something went wrong");
                setIsProcessing(false);
            }
        } catch (error) {
            toast.error("Could not connect to the server");
            setIsProcessing(false);
        }
    };

    return (
        <section className="section__container bg-white min-h-screen py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <form onSubmit={handleFinalOrder} className="flex flex-col lg:flex-row gap-12">
                    
                    <div className="lg:w-2/3">
                        <h2 className="text-xl font-bold mb-6 border-b pb-2 text-dark uppercase tracking-tight">Delivery Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input required name="firstName" placeholder="First Name" className="border p-3 rounded-lg w-full focus:outline-none focus:border-indigo-500 bg-gray-50 text-sm" onChange={onChange} />
                            <input required name="lastName" placeholder="Last Name" className="border p-3 rounded-lg w-full focus:outline-none focus:border-indigo-500 bg-gray-50 text-sm" onChange={onChange} />
                        </div>
                        
                        <input required type="email" name="email" value={formData.email} readOnly={!!user?.email} placeholder="Email Address" className={`border p-3 rounded-lg w-full mb-4 focus:outline-none focus:border-indigo-500 text-sm ${user?.email ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'}`} onChange={onChange} />
                        <input required name="street" placeholder="Street Address" className="border p-3 rounded-lg w-full mb-4 focus:outline-none focus:border-indigo-500 bg-gray-50 text-sm" onChange={onChange} />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input required name="city" placeholder="City" className="border p-3 rounded-lg w-full focus:outline-none focus:border-indigo-500 bg-gray-50 text-sm" onChange={onChange} />
                            <input required name="state" placeholder="Province / State" className="border p-3 rounded-lg w-full focus:outline-none focus:border-indigo-500 bg-gray-50 text-sm" onChange={onChange} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input required name="zipCode" placeholder="Zip Code" className="border p-3 rounded-lg w-full focus:outline-none focus:border-indigo-500 bg-gray-50 text-sm" onChange={onChange} />
                            <input required name="country" value={formData.country} placeholder="Country" className="border p-3 rounded-lg w-full focus:outline-none focus:border-indigo-500 bg-gray-50 text-sm" onChange={onChange} />
                        </div>

                        <input required type="text" name="phone" placeholder="Mobile Number (e.g. 03001234567)" className="border p-3 rounded-lg w-full mb-4 focus:outline-none focus:border-indigo-500 bg-gray-50 text-sm" onChange={onChange} />
                    
                        <div className="mt-6">
                            <h3 className="text-lg font-bold mb-3 text-dark uppercase">Payment Method</h3>
                            <div className="flex flex-wrap gap-3">
                                <label className={`flex items-center gap-3 border p-3 rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'}`}>
                                    <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="w-4 h-4 accent-indigo-600" />
                                    <span className="text-sm font-semibold">Cash on Delivery</span>
                                </label>

                                <label className={`flex items-center gap-3 border p-3 rounded-xl cursor-pointer transition-all ${paymentMethod === 'MANUAL' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'}`}>
                                    <input type="radio" name="payment" checked={paymentMethod === 'MANUAL'} onChange={() => setPaymentMethod('MANUAL')} className="w-4 h-4 accent-indigo-600" />
                                    {/* ✅ Bank Account Option Included */}
                                    <span className="text-sm font-semibold">EasyPaisa / JazzCash / Bank Transfer</span>
                                </label>
                            </div>

                            {paymentMethod === 'MANUAL' && (
                                <div className="mt-5 bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-100">
                                    <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800">Manual Payment Summary</h4>
                                    <div className="flex justify-between items-center mb-5">
                                        <span className="text-sm text-gray-500">Total Payable Amount:</span>
                                        <span className="text-xl font-bold text-indigo-600">Rs. {finalAmount.toLocaleString()}</span>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className={`w-full text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all uppercase tracking-wider ${isProcessing ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'}`}
                                    >
                                        {isProcessing ? "PROCESSING..." : "Start Chat for Payment Verification"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-gray-50 p-5 rounded-3xl shadow-lg border border-gray-100 sticky top-10">
                            <h2 className="text-lg font-bold mb-4 text-dark uppercase tracking-wider border-b pb-2">Order Summary</h2>
                            
                            <div className="max-h-48 overflow-y-auto mb-4 space-y-3 pr-1">
                                {products.map((item) => (
                                    <div key={item._id} className="flex gap-3 items-center">
                                        <img src={Array.isArray(item.image) ? item.image[0] : item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md border" />
                                        <div className="flex-1">
                                            <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                                            <p className="text-[10px] text-gray-500">{item.quantity} x Rs. {Number(item.price).toLocaleString()}</p>
                                        </div>
                                        <p className="text-xs font-bold">Rs. {(item.quantity * item.price).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 border-t pt-3 text-xs text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold text-dark">Rs. {totalPrice.toLocaleString()}</span>
                                </div>
                                {/* ✅ Tax Row Removed aur Shipping Update */}
                                <div className="flex justify-between text-indigo-600 font-medium">
                                    <span>Shipping Fee:</span>
                                    <span>Rs. {shippingFee.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex justify-between font-bold text-xl py-4 mt-3 border-t">
                                <span className="text-dark">Total:</span>
                                <span className="text-indigo-600">Rs. {finalAmount.toLocaleString()}</span>
                            </div>

                            {paymentMethod === 'COD' && (
                                <button 
                                    type="submit"
                                    disabled={isProcessing || products.length === 0}
                                    className={`w-full text-white mt-2 py-3.5 rounded-xl font-bold text-md shadow-md transition-all uppercase tracking-wider ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'}`}
                                >
                                    {isProcessing ? "PROCESSING..." : "CONFIRM ORDER"}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default CheckoutPage;