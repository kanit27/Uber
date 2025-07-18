import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

const GROCERY_ITEMS = [
  { name: "Rice", icon: "🍚" },
  { name: "Wheat Flour", icon: "🌾" },
  { name: "Sugar", icon: "🍬" },
  { name: "Salt", icon: "🧂" },
  { name: "Milk", icon: "🥛" },
  { name: "Eggs", icon: "🥚" },
  { name: "Bread", icon: "🍞" },
  { name: "Tea", icon: "🍵" },
  { name: "Oil", icon: "🛢️" },
  { name: "Potato", icon: "🥔" },
  { name: "Onion", icon: "🧅" },
  { name: "Tomato", icon: "🍅" },
];

const ShopHome = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [ownerName, setOwnerName] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopId, setShopId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]); // All products
  const [newProduct, setNewProduct] = useState({
    name: "",
    icon: "",
    price: "",
    stock: "",
  });
  const [editIdx, setEditIdx] = useState(null);
  const [editProduct, setEditProduct] = useState({
    name: "",
    icon: "",
    price: "",
    stock: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const shopRaw = localStorage.getItem("shop");
    let shopObj = null;
    try {
      if (shopRaw && shopRaw.startsWith("{")) {
        shopObj = JSON.parse(shopRaw);
      }
    } catch (e) {
      shopObj = null;
    }
    if (shopObj) {
      setShopName(shopObj.shopname || "");
      setShopId(shopObj._id || "");
      setIsOpen(shopObj.isOpen || false);
      if (shopObj.ownername && shopObj.ownername.firstname) {
        setOwnerName(
          shopObj.ownername.firstname +
            (shopObj.ownername.lastname ? " " + shopObj.ownername.lastname : "")
        );
      } else {
        setOwnerName("");
      }
      // Load saved products if present
      if (shopObj.products && Array.isArray(shopObj.products)) {
        setProducts(shopObj.products);
      }
    } else {
      setShopName("");
      setOwnerName("");
      setShopId("");
    }
  }, []);

  useEffect(() => {
    const shopRaw = localStorage.getItem("shop");
    let shopObj = null;
    try {
      if (shopRaw && shopRaw.startsWith("{")) {
        shopObj = JSON.parse(shopRaw);
      }
    } catch (e) {
      shopObj = null;
    }

    if (shopObj && shopObj._id) {
      const token = localStorage.getItem("shop_token");
      if (!token) {
        console.warn("Shop token not found");
        return;
      }

      axios
        .get(`${import.meta.env.VITE_BASE_URL}/orders/shop`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setOrders(res.data.orders || []);
        })
        .catch((err) => {
          console.error("Error fetching shop orders:", err);
        });

      socket.connect();
      socket.emit("join_shop", shopObj._id);
      socket.on("new-order", (order) => {
        setOrders((prev) => {
          if (prev.some((o) => o._id === order._id)) return prev;
          return [order, ...prev];
        });
      });
    }

    return () => {
      socket.off("new-order");
      socket.disconnect();
    };
  }, []);

  const toggleShopStatus = async () => {
    const newStatus = !isOpen;
    setIsOpen(newStatus);

    // Update in backend
    const token = localStorage.getItem("shop_token");

    await fetch(`${import.meta.env.VITE_BASE_URL}/shops/${shopId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Add this
      },
      body: JSON.stringify({ isOpen: newStatus }),
    });

    // Update localStorage for instant UI
    const shopRaw = localStorage.getItem("shop");
    if (shopRaw) {
      let shopObj = JSON.parse(shopRaw);
      shopObj.isOpen = newStatus;
      localStorage.setItem("shop", JSON.stringify(shopObj));
      // Emit socket event to update all clients
      socket.emit("shop_location_update", {
        shopId: shopObj._id,
        location: shopObj.location,
        isOpen: newStatus,
        shopname: shopObj.shopname,
        ownername: shopObj.ownername,
      });
    }
  };

  // Add or update product in products array
  const handleAddOrUpdateProduct = () => {
    if (
      !newProduct.name ||
      !newProduct.icon ||
      !newProduct.price ||
      !newProduct.stock
    ) {
      alert("Please fill all fields");
      return;
    }
    setProducts((prev) => {
      // If product with same name exists, update it
      const idx = prev.findIndex((p) => p.name === newProduct.name);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          ...newProduct,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock),
        };
        return updated;
      }
      // Else add new product
      return [
        ...prev,
        {
          ...newProduct,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock),
        },
      ];
    });
    setNewProduct({ name: "", icon: "", price: "", stock: "" });
  };

  // Edit product inline
  const handleProductChange = (idx, field, value) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        [field]: field === "price" || field === "stock" ? Number(value) : value,
      };
      return updated;
    });
  };

  // Remove product
  const handleRemoveProduct = (idx) => {
    setProducts((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save all products to backend
  const handleSave = async () => {
    const productsToSave = products.map(({ icon, name, price, stock }) => ({
      icon,
      name,
      price,
      stock,
      isAvailable: true,
    }));
    // Save to backend
    await fetch(`${import.meta.env.VITE_BASE_URL}/shops/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopId, products: productsToSave }),
    });
    // Update local saved products for immediate UI feedback
    // Optionally update localStorage for instant ShopView update
    const shopRaw = localStorage.getItem("shop");
    if (shopRaw) {
      let shopObj = JSON.parse(shopRaw);
      shopObj.products = products;
      localStorage.setItem("shop", JSON.stringify(shopObj));
    }
    alert("Products saved!");
  };

  // Open edit modal
  const openEditModal = (idx) => {
    setEditIdx(idx);
    setEditProduct(products[idx]);
    setShowEditModal(true);
  };
  // Save edit
  const handleEditSave = () => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[editIdx] = {
        ...editProduct,
        price: Number(editProduct.price),
        stock: Number(editProduct.stock),
      };
      return updated;
    });
    setShowEditModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 p-8 text-center">
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>
              Welcome, <b>{ownerName}</b>!
            </p>
            <p>
              Your shop: <b>{shopName}</b>
            </p>

            {/* Shop Status Toggle */}
            <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-3">Shop Status</h3>
              <div className="flex items-center justify-center space-x-4">
                <span className="text-gray-600">Shop is currently:</span>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isOpen ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`font-semibold ${
                      isOpen ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOpen ? "Open" : "Closed"}
                  </span>
                </div>
              </div>
              <button
                onClick={toggleShopStatus}
                className={`mt-4 px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isOpen
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isOpen ? "Close Shop" : "Open Shop"}
              </button>
            </div>

            <p className="mt-4 text-gray-600">This is your shop dashboard.</p>
          </div>
        )}
        {activeTab === "products" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
            {/* Add Product Card */}
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8 border">
              <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
              <div className="flex flex-col gap-3">
                <select
                  className="border p-2 rounded"
                  value={newProduct.icon}
                  onChange={(e) => {
                    const selected = GROCERY_ITEMS.find(
                      (i) => i.icon === e.target.value
                    );
                    setNewProduct({
                      ...newProduct,
                      icon: selected?.icon || "",
                      name: selected?.name || "",
                    });
                  }}
                >
                  <option value="">Select Product</option>
                  {GROCERY_ITEMS.map((item) => (
                    <option key={item.name} value={item.icon}>
                      {item.icon} {item.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Price"
                  className="border p-2 rounded"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Stock"
                  className="border p-2 rounded"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: e.target.value })
                  }
                />
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700 transition"
                  onClick={handleAddOrUpdateProduct}
                >
                  Add / Update Product
                </button>
              </div>
            </div>
            {/* Product List Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg shadow p-4 flex flex-col items-center border relative"
                  >
                    <span className="text-4xl mb-2">{product.icon}</span>
                    <span className="font-semibold text-lg">
                      {product.name}
                    </span>
                    <span className="text-gray-600">
                      Price: ₹{product.price}
                    </span>
                    <span className="text-gray-600">
                      Stock: {product.stock}
                    </span>
                    <div className="flex gap-2 mt-3">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        onClick={() => openEditModal(idx)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        onClick={() => handleRemoveProduct(idx)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-8">No products added yet.</p>
            )}
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded mt-10 shadow hover:bg-blue-700 transition"
              onClick={handleSave}
              disabled={products.length === 0}
            >
              Save All Products
            </button>
            {/* Edit Modal */}
            {showEditModal && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-80 shadow-lg relative">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                    onClick={() => setShowEditModal(false)}
                  >
                    &times;
                  </button>
                  <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      className="border p-2 rounded"
                      value={editProduct.name}
                      disabled
                    />
                    <input
                      type="text"
                      className="border p-2 rounded"
                      value={editProduct.icon}
                      disabled
                    />
                    <input
                      type="number"
                      className="border p-2 rounded"
                      value={editProduct.price}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          price: e.target.value,
                        })
                      }
                      placeholder="Price"
                    />
                    <input
                      type="number"
                      className="border p-2 rounded"
                      value={editProduct.stock}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          stock: e.target.value,
                        })
                      }
                      placeholder="Stock"
                    />
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700 transition"
                      onClick={handleEditSave}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === "settings" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Settings</h1>

            {/* Shop Status in Settings */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border text-left max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-3">
                Shop Status Control
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isOpen ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`font-medium ${
                      isOpen ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOpen ? "Open" : "Closed"}
                  </span>
                </div>
                <button
                  onClick={toggleShopStatus}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isOpen
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {isOpen ? "Close" : "Open"}
                </button>
              </div>
            </div>

            <p className="mb-2 font-semibold">Shop Details</p>
            <div className="text-left mx-auto max-w-md bg-gray-100 rounded p-4">
              {(() => {
                const shopRaw = localStorage.getItem("shop");
                let shopObj = null;
                try {
                  if (shopRaw && shopRaw.startsWith("{")) {
                    shopObj = JSON.parse(shopRaw);
                  }
                } catch (e) {
                  shopObj = null;
                }
                if (!shopObj) return <p>No shop data found.</p>;
                return (
                  <ul className="list-disc pl-4">
                    <li>
                      <b>Shop Name:</b> {shopObj.shopname}
                    </li>
                    <li>
                      <b>Owner:</b> {shopObj.ownername?.firstname}{" "}
                      {shopObj.ownername?.lastname}
                    </li>
                    <li>
                      <b>Email:</b> {shopObj.email}
                    </li>
                    <li>
                      <b>Phone:</b> {shopObj.phone}
                    </li>
                    <li>
                      <b>Type:</b> {shopObj.shopType}
                    </li>
                    <li>
                      <b>Description:</b> {shopObj.description}
                    </li>
                    <li>
                      <b>Rating:</b> {shopObj.rating}
                    </li>
                    <li>
                      <b>Verified:</b> {shopObj.isVerified ? "Yes" : "No"}
                    </li>
                    <li>
                      <b>Open:</b> {isOpen ? "Yes" : "No"}
                    </li>
                    <li>
                      <b>Business Hours:</b> {shopObj.businessHours?.open} -{" "}
                      {shopObj.businessHours?.close}
                    </li>
                    <li>
                      <b>Address:</b> {shopObj.address?.street},{" "}
                      {shopObj.address?.city}, {shopObj.address?.state}{" "}
                      {shopObj.address?.zipcode}
                    </li>
                    <li>
                      <b>Location:</b>{" "}
                      {shopObj.location?.coordinates?.join(", ")}
                    </li>
                    <li>
                      <b>ID:</b> {shopObj._id}
                    </li>
                  </ul>
                );
              })()}
            </div>
          </div>
        )}
        {activeTab === "orders" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Recent Orders</h1>
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders yet.</p>
            ) : (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li key={order._id} className="bg-white rounded shadow p-4">
                    <div className="font-semibold">Order #{order._id}</div>
                    <div>Total: ₹{order.totalAmount}</div>
                    <div>
                      Placed: {new Date(order.placedAt).toLocaleString()}
                    </div>
                    <div>Status: {order.status}</div>
                    <ul className="mt-2 text-sm">
                      {order.products.map((item, idx) => (
                        <li key={idx}>
                          {item.name} × {item.quantity} — ₹
                          {item.price * item.quantity}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <nav className="flex justify-around border-t border-gray-200 py-4 bg-gray-50 fixed left-0 right-0 bottom-0 z-10">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`bg-none border-none outline-none text-base cursor-pointer transition-colors ${
            activeTab === "dashboard"
              ? "text-blue-600 font-bold"
              : "text-gray-800 font-normal"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`bg-none border-none outline-none text-base cursor-pointer transition-colors ${
            activeTab === "products"
              ? "text-blue-600 font-bold"
              : "text-gray-800 font-normal"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`bg-none border-none outline-none text-base cursor-pointer transition-colors ${
            activeTab === "settings"
              ? "text-blue-600 font-bold"
              : "text-gray-800 font-normal"
          }`}
        >
          Settings
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`bg-none border-none outline-none text-base cursor-pointer transition-colors ${
            activeTab === "orders"
              ? "text-blue-600 font-bold"
              : "text-gray-800 font-normal"
          }`}
        >
          Orders
        </button>
      </nav>
      <div className="h-20"></div>
    </div>
  );
};

export default ShopHome;
