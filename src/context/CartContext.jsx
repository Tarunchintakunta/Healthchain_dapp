import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Load cart from local storage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('healthdapp_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);
  
  // Save cart to local storage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('healthdapp_cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('healthdapp_cart');
    }
    
    // Calculate total price
    const total = cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    setTotalPrice(total);
  }, [cartItems]);
  
  // Add medication to cart
  const addToCart = (medication, packageSize, quantity) => {
    const packageFactor = packageSize === 10 ? 1 : packageSize === 30 ? 2.8 : 5.5;
    const totalPrice = (medication.priceWei / 1e18) * packageFactor * quantity;
    
    const newItem = {
      id: `${medication.id}-${packageSize}`,
      medicationId: medication.id,
      name: medication.name,
      description: medication.description,
      category: medication.category,
      packageSize,
      quantity,
      pricePerUnit: medication.priceWei / 1e18,
      totalPrice,
    };
    
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === newItem.id
    );
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      updatedCart[existingItemIndex].totalPrice += totalPrice;
      setCartItems(updatedCart);
    } else {
      // Add new item
      setCartItems([...cartItems, newItem]);
    }
  };
  
  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };
  
  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 5) return;
    
    const updatedCart = cartItems.map((item) => {
      if (item.id === itemId) {
        const packageFactor = item.packageSize === 10 ? 1 : item.packageSize === 30 ? 2.8 : 5.5;
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: item.pricePerUnit * packageFactor * newQuantity,
        };
      }
      return item;
    });
    
    setCartItems(updatedCart);
  };
  
  // Clear the cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('healthdapp_cart');
  };
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};