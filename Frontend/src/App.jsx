import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Start from './pages/Start';
import CaptionLogin from './pages/captionLogin';
import CaptionSignUp from './pages/captionSignUp';
import './App.css';
import Home from './pages/Home';
import CaptionHome from './pages/CaptionHome'
import UserProtectedWrapper from './pages/UserProtectedWrapper';
import UserSignUp from './pages/userSignUp';
import UserLogin from './pages/UserLogin';
import UserLogout from './pages/UserLogout';
import Search from './pages/Search';


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
          path="/search"
          element={
            <UserProtectedWrapper>
            <Search />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/users/logout"
          element={
            <UserProtectedWrapper>
              <UserLogout />
            </UserProtectedWrapper>
          }
        />
        <Route path="/caption-home" element={
          <CaptionHome />
        } />
      </Routes>
    </div>
  );
}

export default App