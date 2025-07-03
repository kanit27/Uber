import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ShopView = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/shops/${shopId}`)
      .then((res) => res.json())
      .then((data) => setShop(data.shop));
  }, [shopId]);

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading shop...</p>
        </div>
      </div>
    );
  }

  const availableProducts = shop.products ? shop.products.filter((p) => p.isAvailable) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">

        <div className="px-4 py-4">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          

          <div className="flex items-start space-x-4">
            {/* Shop Avatar */}
            <div className="flex-shrink-0">

              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {shop.shopname?.charAt(0).toUpperCase() || 'S'}
              </div>
            </div>
            
            {/* Shop Info */}
            <div className="flex-1">


              <h1 className="text-2xl font-bold text-gray-900 mb-2">{shop.shopname}</h1>
              
              {/* Shop Status - More Prominent */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                shop.isOpen 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${shop.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-semibold">
                  {shop.isOpen ? 'Currently Open' : 'Currently Closed'}
                </span>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">

                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Owner: {shop.ownername?.firstname} {shop.ownername?.lastname}</span>
                </div>






                {shop.rating > 0 && (
                  <div className="flex items-center">

                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{shop.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Closed Notice */}
      {!shop.isOpen && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4 rounded-r-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 font-medium">
              This shop is currently closed. You can browse products but orders may not be available.
            </p>
          </div>
        </div>
      )}

      {/* Products Section */}




      <div className="px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Available Products</h2>
          <p className="text-gray-600 text-sm">Fresh items available for delivery</p>
        </div>

        {availableProducts.length > 0 ? (

          <div className="grid grid-cols-3 gap-3">
            {availableProducts.map((product, idx) => (

              <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Product Image Placeholder */}


                <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-2xl">{product.icon || '🛍️'}</span>
                </div>
                
                {/* Product Info */}


                <div className="p-3">
                  <h3 className="font-medium text-gray-900 mb-1 text-sm truncate">{product.name}</h3>
                  <div className="flex items-center justify-between">







                    <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                  </div>



                  <button 
                    className={`w-full px-2 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 mt-2 flex items-center justify-center space-x-1 ${
                      shop.isOpen 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                    disabled={!shop.isOpen}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>{shop.isOpen ? 'Add' : 'Closed'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (



          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>


            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600 text-sm">This shop doesn't have any products available at the moment.</p>
          </div>
        )}
      </div>




      {/* Floating Action Button for Cart */}
      <div className="fixed bottom-4 right-4">
        <button 
          className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
            shop.isOpen 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
          disabled={!shop.isOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0L17 18m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ShopView;