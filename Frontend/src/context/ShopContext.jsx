import React, { createContext, useState } from 'react';

export const ShopDataContext = createContext();

const ShopContext = ({ children }) => {
  const [shop, setShop] = useState({
    email: "",
    shopname: "",
    ownername: {
      firstname: "",
      lastname: "",
    },
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "India",
    },
    shopType: "",
    description: "",
    businessHours: {
      open: "09:00",
      close: "21:00",
    },
    location: { type: "Point", coordinates: [0, 0] },
  });

  return (
    <ShopDataContext.Provider value={{ shop, setShop }}>
      {children}
    </ShopDataContext.Provider>
  );
};

export default ShopContext;