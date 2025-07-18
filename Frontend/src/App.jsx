import React from "react";
import { Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import CaptionLogin from "./pages/captionLogin";
import CaptionSignUp from "./pages/captionSignUp";
import "./App.css";
import Home from "./pages/home";
import CaptionHome from "./pages/CaptionHome";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import UserSignUp from "./pages/userSignUp";
import UserLogin from "./pages/userLogin";
// import UserLogout from './pages/UserLogout';
import CaptionProtectedWrapper from "./pages/CaptionProtectedWrapper";
import CaptionProfile from "./pages/CaptionProfile";
import UserProfile from "./pages/UserProfile";
import ShopLogin from "./pages/ShopLogin";
import ShopSignUp from "./pages/ShopSignUp";
import ShopHome from "./pages/ShopHome";
import ShopContext from "./context/ShopContext";
import ShopView from "./pages/ShopView";
import ShopProtectedWrapper from "./pages/ShopProtectedWrapper";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/caption-login" element={<CaptionLogin />} />
        <Route path="/caption-signup" element={<CaptionSignUp />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-signup" element={<UserSignUp />} />
        <Route path="/shop-login" element={<ShopLogin />} />
        <Route path="/shop-signup" element={<ShopSignUp />} />
        <Route
          path="/home"
          element={
            <UserProtectedWrapper>
              <Home />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/caption-home"
          element={
            <CaptionProtectedWrapper>
              <CaptionHome />
            </CaptionProtectedWrapper>
          }
        />
        <Route
          path="/caption-profile"
          element={
            <CaptionProtectedWrapper>
              <CaptionProfile />
            </CaptionProtectedWrapper>
          }
        />
        <Route
          path="/user-profile"
          element={
            <UserProtectedWrapper>
              <UserProfile />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/shop-home"
          element={
            <ShopProtectedWrapper>
              <ShopContext>

        <ShopHome />
              </ShopContext>
    </ShopProtectedWrapper>
          }
        />
        <Route path="/shop/:shopId" element={
          <ShopProtectedWrapper>  
        <ShopView />
    </ShopProtectedWrapper>
          } />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<OrderHistory />} />
      </Routes>
    </div>
  );
};

export default App;
