import React from "react";
import { useLocation, Link } from "react-router-dom";

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Order Placed Successfully!</h1>
        <p className="mb-2">Thank you for your order.</p>
        {order && (
          <div className="mb-4">
            <div><b>Order ID:</b> {order._id}</div>
            <div><b>Total:</b> ₹{order.totalAmount}</div>
            <div><b>Items:</b> {order.products.length}</div>
          </div>
        )}
        <Link to="/orders" className="text-blue-600 underline">View Order History</Link>
        <br />
        <Link to="/home" className="text-gray-600 underline">Back to Home</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;