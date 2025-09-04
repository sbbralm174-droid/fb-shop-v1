'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useUser } from './UserContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user, loading: userLoading } = useUser();
  const isInitialLoad = useRef(true);

  const saveCartToDb = async (userId, cartItems) => {
    if (!userId) {
      console.error("Cannot save cart: User ID is missing.");
      return;
    }

    if (isInitialLoad.current && cartItems.length === 0) {
      console.log("Initial load, not saving empty cart to DB.");
      return;
    }

    try {
      console.log(`Saving cart to DB for user ${userId}, items count: ${cartItems.length}`);
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, items: cartItems }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save cart to database: ${errorData.error || 'Unknown error'}`);
      }
      console.log('Cart saved to database successfully.');
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const fetchCartFromDb = async (userId) => {
    if (!userId) {
      console.error("Cannot fetch cart: User ID is missing.");
      return;
    }

    try {
      console.log(`Attempting to fetch cart for user ID: ${userId}`);
      const response = await fetch(`/api/cart?userId=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch cart from database: ${errorData.error || 'Unknown error'}`);
      }
      const data = await response.json();
      if (data.success && data.data && data.data.items) {
        console.log("Cart fetched from DB:", data.data.items);
        setCart(data.data.items);
      } else {
        console.log("No cart found for user, setting empty cart.");
        setCart([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      isInitialLoad.current = false;
    }
  };

  useEffect(() => {
    if (!userLoading) {
      if (user) {
        console.log("User logged in. Fetching cart from DB.");
        fetchCartFromDb(user.uid);
      } else {
        console.log("User logged out. Clearing cart.");
        setCart([]);
        isInitialLoad.current = true;
      }
    }
  }, [user, userLoading]);

  useEffect(() => {
    if (user && !userLoading && !isInitialLoad.current) {
      const timeoutId = setTimeout(() => {
        saveCartToDb(user.uid, cart);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [cart, user, userLoading]);

  const addToCart = (productToAdd) => {
    setCart((currentCart) => {
      // FIX: Add a check to ensure item.productId, item.color, and item.size exist before trying to access them.
      // This prevents the "Cannot read properties of undefined" error.
      const existingItem = currentCart.find(
        (item) =>
          item.productId && item.productId.toString() === productToAdd._id.toString() &&
          item.color && item.color.name === productToAdd.color.name &&
          item.size && item.size.size === productToAdd.size.size
      );

      if (existingItem) {
        // If the product exists, create a new array with the quantity incremented by 1
        return currentCart.map((item) =>
          item === existingItem
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If the product is new, add it to the cart with quantity 1
        return [...currentCart, { ...productToAdd, productId: productToAdd._id, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) => currentCart.filter((item) => item.productId && item.productId.toString() !== productId));
  };

  const updateQuantity = (productToUpdate, newQuantity) => {
    if (newQuantity <= 0) {
      // NOTE: The uniqueId from CartPage is passed, which is a string like "id-color-size".
      // The removeFromCart function expects a simple product ID.
      // You may need to adjust this logic if you want to remove an item based on its uniqueId.
      // For now, it's just passing the whole uniqueId string, which won't match a simple productId.
      // Consider passing a simple productId from the CartPage component instead.
      removeFromCart(productToUpdate.productId);
    } else {
      setCart((currentCart) =>
        currentCart.map((item) => {
          // FIX: Add a check for item properties before using them to prevent the 'undefined' error.
          if (
            item.productId && item.productId.toString() === productToUpdate.productId.toString() &&
            item.color && item.color.name === productToUpdate.color.name &&
            item.size && item.size.size === productToUpdate.size.size
          ) {
            // If a match is found, return a new object with the updated quantity
            return { ...item, quantity: newQuantity };
          }
          // Otherwise, return the item unchanged
          return item;
        })
      );
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      // FIX: Add a check for item.size to prevent errors if the property is missing.
      const itemPrice = item.size?.price || 0;
      const itemQuantity = item.quantity || 0;
      return total + (itemPrice * itemQuantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
