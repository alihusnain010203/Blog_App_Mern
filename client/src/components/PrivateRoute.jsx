import React from "react";
import { useSelector } from "react-redux";
import Dashboard from "../pages/Dashboard";
import SignIn from "../pages/SignIn";
import { Outlet ,Navigate} from "react-router-dom";
const PrivateRoute = () => {
  const user = useSelector((state) => state.user);
  return <>{user.user ? <Outlet /> : <Navigate to='sign-in'/>}</>;
};

export default PrivateRoute;
