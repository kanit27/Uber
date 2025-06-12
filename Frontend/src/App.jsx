import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Start from './pages/Start';
import CaptionLogin from './pages/captionLogin';
import CaptionSignUp from './pages/captionSignUp';
import './App.css';
import Home from './pages/home';
import CaptionHome from './pages/CaptionHome'
import UserProtectedWrapper from './pages/UserProtectedWrapper';
import UserSignUp from './pages/userSignUp';
import UserLogin from './pages/userLogin';
// import UserLogout from './pages/UserLogout';
import CaptionProtectedWrapper from './pages/CaptionProtectedWrapper';
import CaptionProfile from './pages/CaptionProfile';
import UserProfile from './pages/UserProfile';



const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/caption-login" element={<CaptionLogin />} />
        <Route path="/caption-signup" element={<CaptionSignUp />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-signup" element={<UserSignUp />} />
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
        {/* <Route
          path="/users/logout"
          element={
            <UserProtectedWrapper>
              <UserLogout />
            </UserProtectedWrapper>
          }
        /> */}
        <Route path="/caption-profile" element={
          <CaptionProfile />
        } />
        <Route path="/user-profile" element={
          <UserProtectedWrapper>
          <UserProfile />
          </UserProtectedWrapper>
        } />
      </Routes>
    </div>
  );
}

export default App