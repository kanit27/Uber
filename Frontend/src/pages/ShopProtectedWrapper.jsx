import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ShopProtectedWrapper = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage (or cookies if you use cookies)
    const token = localStorage.getItem("shop_token");
    if (!token) {
      navigate("/shop-login");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default ShopProtectedWrapper;