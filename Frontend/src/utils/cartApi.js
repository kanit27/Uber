import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const addToCart = async (product, token) => {
  try {
    console.log('API Call - Adding to cart:', { product, token: token ? 'present' : 'missing' });

    const res = await axios.post(`${BASE_URL}/cart/add`, product, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return res.data;
  } catch (error) {
    console.error('Cart API Error:', error.response?.data || error.message);
    throw error;
  }
};


export const removeFromCart = async (productId, token) => {
  try {
    const res = await axios.delete(`${BASE_URL}/cart/remove/${productId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (error) {
    console.error('Remove from cart API Error:', error.response?.data || error.message);
    throw error;
  }
};

export const getCart = async (token) => {
  try {
    const res = await axios.get(`${BASE_URL}/cart`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (error) {
    console.error('Get cart API Error:', error.response?.data || error.message);
    throw error;
  }
};

export const placeOrder = async (shopId, token) => {
  try {
    const res = await axios.post(`${BASE_URL}/orders`, { shopId }, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (error) {
    console.error('Place order API Error:', error.response?.data || error.message);
    throw error;
  }
};
