import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart from backend on mount
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setCart([]);
      return;
    }
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart?.products || []);
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1]
    );
  };

  const handleAddToCart = async (product) => {
    setLoading(true);
    const token = getToken();
    if (!token) throw new Error("Authentication token not found");

    const shopId = window.location.pathname.split("/shop/")[1];
    if (!shopId) throw new Error("Shop ID is missing in route");

    const productData = {
      productId: product.productId,
      name: product.name,
      price: product.price,
      quantity: product.quantity || 1,
      icon: product.icon,
      shopId: shopId,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/cart/add`,
        productData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Always update cart from backend response
      setCart(response.data.cart?.products || []);
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    setLoading(true);
    const token = getToken();
    if (!token) throw new Error("Authentication token not found");

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Always update cart from backend response
      setCart(response.data.cart?.products || []);
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    const token = getToken();
    if (!token) throw new Error("Authentication token not found");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/orders/place`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart([]); // Cart is cleared after order
      return response.data;
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    handleAddToCart,
    handleRemoveFromCart,
    handlePlaceOrder,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
