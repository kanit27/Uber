import React from 'react'
import Maps from '../components/Maps';
import Header from '../components/Header';
import GoOnline from '../components/GoOnline';

const Home = () => {
  return (
    <div className=" h-screen w-screen ">
      <Header />
      <Maps />
      <GoOnline />
    </div>
  );
}

export default Home