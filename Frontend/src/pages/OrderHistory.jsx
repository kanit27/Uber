import React, { useEffect, useState } from "react";
import { FiShoppingCart, FiClock } from "react-icons/fi";

const statusStyles = {
  Delivered: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Cancelled: "bg-red-100 text-red-800",
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/orders/history`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center space-y-4">
        <div className="animate-spin text-gray-400">
          <FiShoppingCart size={48} />
        </div>
        <span className="text-gray-500">Loading your orders…</span>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="p-12 text-center text-gray-600">
        <FiClock className="mx-auto mb-4 text-4xl text-yellow-400" />
        <p className="text-lg">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-800">
        Your Order History
      </h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-xl shadow hover:shadow-2xl transition-transform transform hover:-translate-y-1"
        >
          <div className="p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Order #{order._id.slice(-6).toUpperCase()}
              </h2>
              <p className="text-sm text-gray-500">
                Placed:{" "}
                {new Date(order.placedAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusStyles[order.status] || "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status}
              </span>
              <span className="text-lg font-bold text-gray-800">
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 uppercase text-xs border-b">
                  <th className="py-2">Product</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {order.products.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b last:border-0 hover:bg-gray-50 transition"
                  >
                    <td className="py-3">{item.name}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
