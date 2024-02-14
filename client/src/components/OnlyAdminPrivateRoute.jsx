import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
const OnlyAdminPrivateRoute = () => {
    const user = useSelector((state) => state.user.user);
  return (
    <>
    {user && user.user.isAdmin ? <Outlet /> : <Navigate to='/'/>}
    </>
  )
}

export default OnlyAdminPrivateRoute