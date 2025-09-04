// src/app/products/[id]/ProductActionButtons.js
'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function ProductActionButtons({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    setIsAdding(true);
    // Add logic to select size and color if not already selected
    const defaultVariant = {
      _id: product._id,
      name: product.name,
      images: product.colors[0].images,
      color: product.colors[0],
      size: product.colors[0].sizes[0]
    };
    addToCart(defaultVariant);
    
    // Simulate a short delay for user feedback
    setTimeout(() => {
      setIsAdding(false);
      alert(`${product.name} has been added to your cart!`);
    }, 500);
  };

  const handleBuyNow = () => {
    setIsBuying(true);
    const defaultVariant = {
      _id: product._id,
      name: product.name,
      images: product.colors[0].images,
      color: product.colors[0],
      size: product.colors[0].sizes[0]
    };
    addToCart(defaultVariant);
    
    // Simulate a short delay before redirecting
    setTimeout(() => {
      setIsBuying(false);
      router.push('/checkout');
    }, 500);
  };

  return (
    <div className="mt-8 flex flex-col md:flex-row gap-4">
      <button
        onClick={handleAddToCart}
        disabled={isAdding || isBuying}
        className={`flex-1 flex justify-center items-center py-3 px-6 rounded-lg shadow-lg text-lg font-semibold transition duration-300
        ${isAdding ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
      >
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>
      <button
        onClick={handleBuyNow}
        disabled={isAdding || isBuying}
        className={`flex-1 flex justify-center items-center py-3 px-6 rounded-lg shadow-lg text-lg font-semibold transition duration-300
        ${isBuying ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
      >
        {isBuying ? 'Redirecting...' : 'Buy Now'}
      </button>
    </div>
  );
}