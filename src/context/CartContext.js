'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useUser } from './UserContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user, loading: userLoading } = useUser();
  const isInitialLoad = useRef(true);

  const saveCartToDb = async (userId, cartItems) => {
    if (!userId) return;
    if (isInitialLoad.current && cartItems.length === 0) return;

    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, items: cartItems }),
      });
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const fetchCartFromDb = async (userId) => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/cart?userId=${userId}`);
      const data = await response.json();
      if (data.success && data.data && data.data.items) {
        setCart(data.data.items);
      } else {
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
        fetchCartFromDb(user.uid);
      } else {
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

  // ✅ এখন PUT ব্যবহার হবে item update করার জন্য
  const addItemToDb = async (userId, itemToSave) => {
    if (!userId) return;
    try {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, item: itemToSave }),
      });
      console.log(`Product ${itemToSave.productId} updated in DB.`);
    } catch (error) {
      console.error('Error adding/updating item in DB:', error);
    }
  };

  const addToCart = async (productToAdd) => {
    if (!user) return;

    try {
      // cart fetch
      const cartResponse = await fetch(`/api/cart?userId=${user.uid}`);
      const cartData = await cartResponse.json();
      const currentCart = cartData.success ? cartData.data.items : [];

      // existing item আছে কিনা চেক
      const existingItem = currentCart.find(
        (item) =>
          item.productId?.toString() === productToAdd._id.toString() &&
          item.color?.name === productToAdd.color.name &&
          item.size?.size === productToAdd.size.size
      );

      let newQuantity = 1;
      if (existingItem) {
        newQuantity = existingItem.quantity + 1;
      }

      // save to DB
      const itemToSave = { ...productToAdd, productId: productToAdd._id, quantity: newQuantity };
      await addItemToDb(user.uid, itemToSave);

      // re-fetch updated cart
      await fetchCartFromDb(user.uid);
    } catch (error) {
      console.error('Error in addToCart:', error);
    }
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) => currentCart.filter((item) => item.productId?.toString() !== productId));
  };

  const updateQuantity = (productToUpdate, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productToUpdate.productId);
    } else {
      setCart((currentCart) =>
        currentCart.map((item) => {
          if (
            item.productId?.toString() === productToUpdate.productId.toString() &&
            item.color?.name === productToUpdate.color.name &&
            item.size?.size === productToUpdate.size.size
          ) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      );
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const itemPrice = item.size?.price || 0;
      const itemQuantity = item.quantity || 0;
      return total + itemPrice * itemQuantity;
    }, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
