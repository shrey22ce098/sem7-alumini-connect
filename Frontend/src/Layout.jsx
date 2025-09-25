import React from 'react'
import Topbar from './Components/Topbar'
import { Navigate, Outlet } from 'react-router-dom'
import Footer from './Components/Footer'
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify'

function Layout() {
  const loggedIn = useSelector((state) => state.loggedIn);
  return (
    <>
      <ToastContainer/>
  
      <Topbar />
      <Outlet />
     

      <Footer />
    </>
  )
}

export default Layout
