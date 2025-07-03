import React, { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ownerName, setOwnerName] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopId, setShopId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [priceMap, setPriceMap] = useState({});
  const [savedProducts, setSavedProducts] = useState([]);

  useEffect(() => {
    const shopRaw = localStorage.getItem('shop');
    let shopObj = null;
    try {
      if (shopRaw && shopRaw.startsWith('{')) {
        shopObj = JSON.parse(shopRaw);
      }
    } catch (e) {
      shopObj = null;
    }
    if (shopObj) {
      setShopName(shopObj.shopname || '');
      setShopId(shopObj._id || '');
      setIsOpen(shopObj.isOpen || false);
      if (shopObj.ownername && shopObj.ownername.firstname) {
        setOwnerName(
          shopObj.ownername.firstname +
            (shopObj.ownername.lastname ? ' ' + shopObj.ownername.lastname : '')
        );
      } else {
        setOwnerName('');
      }
      // Load saved products if present
      if (shopObj.products && Array.isArray(shopObj.products)) {
        setSavedProducts(shopObj.products);
      }
    } else {
      setShopName('');
      setOwnerName('');
      setShopId('');
    }
  }, []);

  const toggleShopStatus = async () => {
    const newStatus = !isOpen;
    setIsOpen(newStatus);

    try {
      // Update shop status in backend
      await fetch(`${import.meta.env.VITE_BASE_URL}/shops/${shopId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOpen: newStatus }),
      });

      // Update localStorage
      const shopRaw = localStorage.getItem('shop');
      if (shopRaw) {
        let shopObj = JSON.parse(shopRaw);
        shopObj.isOpen = newStatus;
        localStorage.setItem('shop', JSON.stringify(shopObj));
        // Emit socket event to update all clients
        socket.emit("shop_location_update", {
          _id: shopObj._id,
          location: shopObj.location,
          isOpen: newStatus,
          shopname: shopObj.shopname,
          ownername: shopObj.ownername,
        });
      }

      alert(`Shop is now ${newStatus ? 'Open' : 'Closed'}`);
    } catch (error) {
      console.error('Error updating shop status:', error);
      // Revert the state if API call fails
      setIsOpen(!newStatus);
      alert('Failed to update shop status. Please try again.');
    }
  };

  const toggleItem = (item) => {
    setSelected((prev) =>
      prev.some((i) => i.name === item.name)
        ? prev.filter((i) => i.name !== item.name)
        : [...prev, item]
    );
  };

  const handleSave = async () => {
    const products = selected.map((item) => ({
      ...item,
      price: priceMap[item.name] || 0,
      isAvailable: true,
    }));
    // Save to backend
    await fetch(`${import.meta.env.VITE_BASE_URL}/shops/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopId, products }),
    });
    // Update local saved products for immediate UI feedback
    setSavedProducts(products);
    // Optionally update localStorage for instant ShopView update
    const shopRaw = localStorage.getItem('shop');
    if (shopRaw) {
      let shopObj = JSON.parse(shopRaw);
      shopObj.products = products;
      localStorage.setItem('shop', JSON.stringify(shopObj));
    }
    alert("Products saved!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-8 text-center">
        {activeTab === 'dashboard' && (
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
                  <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-semibold ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
                    {isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
              <button
                onClick={toggleShopStatus}
                className={`mt-4 px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isOpen
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isOpen ? 'Close Shop' : 'Open Shop'}
              </button>
            </div>
            
            <p className="mt-4 text-gray-600">This is your shop dashboard.</p>
          </div>
        )}
        {activeTab === 'products' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {GROCERY_ITEMS.map((item) => (
                <div
                  key={item.name}
                  className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center ${
                    selected.some((i) => i.name === item.name)
                      ? "bg-green-100 border-green-500"
                      : "bg-white"
                  }`}
                  onClick={() => toggleItem(item)}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span>{item.name}</span>
                  {selected.some((i) => i.name === item.name) && (
                    <input
                      type="number"
                      placeholder="Price"
                      className="mt-2 border p-1 w-20"
                      value={priceMap[item.name] || ""}
                      onChange={(e) =>
                        setPriceMap({ ...priceMap, [item.name]: e.target.value })
                      }
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleSave}
              disabled={selected.length === 0}
            >
              Save Products
            </button>
            {savedProducts.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Saved Products</h2>
                <ul className="list-none p-0 flex flex-wrap gap-4 justify-center">
                  {savedProducts.map((product, idx) => (
                    <li key={idx} className="flex flex-col items-center border rounded p-2 bg-white">
                      <span className="text-2xl">{product.icon}</span>
                      <span>{product.name}</span>
                      <span className="text-gray-600">₹{product.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {activeTab === 'settings' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            
            {/* Shop Status in Settings */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border text-left max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-3">Shop Status Control</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-medium ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
                    {isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                <button
                  onClick={toggleShopStatus}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isOpen
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isOpen ? 'Close' : 'Open'}
                </button>
              </div>
            </div>

            <p className="mb-2 font-semibold">Shop Details</p>
            <div className="text-left mx-auto max-w-md bg-gray-100 rounded p-4">
              {(() => {
                const shopRaw = localStorage.getItem('shop');
                let shopObj = null;
                try {
                  if (shopRaw && shopRaw.startsWith('{')) {
                    shopObj = JSON.parse(shopRaw);
                  }
                } catch (e) {
                  shopObj = null;
                }
                if (!shopObj) return <p>No shop data found.</p>;
                return (
                  <ul className="list-disc pl-4">
                    <li><b>Shop Name:</b> {shopObj.shopname}</li>
                    <li><b>Owner:</b> {shopObj.ownername?.firstname} {shopObj.ownername?.lastname}</li>
                    <li><b>Email:</b> {shopObj.email}</li>
                    <li><b>Phone:</b> {shopObj.phone}</li>
                    <li><b>Type:</b> {shopObj.shopType}</li>
                    <li><b>Description:</b> {shopObj.description}</li>
                    <li><b>Rating:</b> {shopObj.rating}</li>
                    <li><b>Verified:</b> {shopObj.isVerified ? "Yes" : "No"}</li>
                    <li><b>Open:</b> {isOpen ? "Yes" : "No"}</li>
                    <li><b>Business Hours:</b> {shopObj.businessHours?.open} - {shopObj.businessHours?.close}</li>
                    <li><b>Address:</b> {shopObj.address?.street}, {shopObj.address?.city}, {shopObj.address?.state} {shopObj.address?.zipcode}</li>
                    <li><b>Location:</b> {shopObj.location?.coordinates?.join(', ')}</li>
                    <li><b>ID:</b> {shopObj._id}</li>
                  </ul>
                );
              })()}
            </div>
          </div>
        )}
      </div>
      <nav className="flex justify-around border-t border-gray-200 py-4 bg-gray-50 fixed left-0 right-0 bottom-0 z-10">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`bg-none border-none outline-none text-base cursor-pointer transition-colors ${
            activeTab === 'dashboard'
              ? 'text-blue-600 font-bold'
              : 'text-gray-800 font-normal'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`bg-none border-none outline-none text-base cursor-pointer transition-colors ${
            activeTab === 'products'
              ? 'text-blue-600 font-bold'
              : 'text-gray-800 font-normal'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`bg-none border-none outline-none text-base cursor-pointer transition-colors ${
            activeTab === 'settings'
              ? 'text-blue-600 font-bold'
              : 'text-gray-800 font-normal'
          }`}
        >
          Settings
        </button>
      </nav>
      <div className="h-20"></div>
    </div>
  );
};

export default ShopHome;
