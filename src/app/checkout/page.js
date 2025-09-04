'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, getCartTotal } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const cartTotal = getCartTotal();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call for order processing
    setTimeout(() => {
      alert('Order placed successfully!');
      // In a real app, you would clear the cart here
      // setCart([]); 
      setIsProcessing(false);
      // Redirect to a thank-you page
      // router.push('/order-confirmation');
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Cart is Empty
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            অনুগ্রহ করে পণ্য যোগ করে আবার চেষ্টা করুন।
          </p>
          <Link href="/products">
            <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 py-12 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white text-center mb-10">
          Checkout
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
          <div className="space-y-4 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
            {cart.map((item) => (
              <div key={`${item._id}-${item.color.name}-${item.size.size}`} className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                <span>
                  {item.name} ({item.color.name}, {item.size.size}) x {item.quantity}
                </span>
                <span>৳{(item.size.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-2xl font-bold text-gray-900 dark:text-white">
            <span>Total:</span>
            <span>৳{cartTotal.toFixed(2)}</span>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Shipping Information</h2>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
              <textarea id="address" name="address" value={formData.address} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"></textarea>
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3 px-6 rounded-lg text-lg font-semibold transition duration-300
              ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}