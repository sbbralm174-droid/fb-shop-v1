'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { user, loading: userLoading } = useUser();
  const cartTotal = getCartTotal();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-800 dark:text-gray-200">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Please log in to view your cart.
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            You need to be signed in to see and manage your shopping cart.
          </p>
          <Link href="/login">
            <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Your Cart is Empty
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            কার্টে এখনো কোনো পণ্য যোগ করা হয়নি।
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white text-center mb-10">
          Your Shopping Cart
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          {/* Cart Items */}
          <div className="space-y-6">
            {cart.map((item) => {
              // FIX: Ensure item properties exist before using them to prevent crashes.
              // The unique ID will now be an object instead of a string,
              // matching the updateQuantity and removeFromCart function signatures.
              const uniqueId = {
                productId: item.productId,
                color: item.color,
                size: item.size
              };
              return (
                <div key={`${item.productId}-${item.color?.name}-${item.size?.size}`} className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 border-b pb-4 last:border-b-0 last:pb-0">
                  <img
                    src={item.images && item.images[0]?.url || 'https://placehold.co/96x96/E5E7EB/4B5563?text=No+Image'}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/96x96/E5E7EB/4B5563?text=No+Image';
                    }}
                  />
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      রঙ: {item.color?.name}, সাইজ: {item.size?.size}
                    </p>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                      ৳{item.size?.price}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 md:mt-0">
                    <button
                      onClick={() => updateQuantity(uniqueId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-lg font-semibold text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(uniqueId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="ml-4 text-red-500 hover:text-red-700 transition"
                      title="Remove Item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Total */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center text-xl font-bold text-gray-900 dark:text-white">
              <span>Total:</span>
              <span>৳{cartTotal.toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="mt-6 block w-full">
              <button className="w-full py-3 px-6 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-300">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
