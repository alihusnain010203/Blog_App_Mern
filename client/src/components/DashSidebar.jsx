import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { HiUser, HiArrowSmRight, HiPencil } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
const DashSidebar = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get("tab");
    setTab(tab);
  }, [location.search]);
  return (
    <Sidebar className="w-full">
      <SidebarItems>
        <SidebarItemGroup>
          {" "}
          <Link to="/dashboard?tab=profile">
            {" "}
            <SidebarItem
              active={tab == "profile"}
              icon={HiUser}
              label={user.user.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as={"div"}
            >
              Profile
            </SidebarItem>
          </Link>
          {user.user.isAdmin && (
            <Link to="/dashboard?tab=posts">
              <SidebarItem
                icon={HiPencil}
                active={tab == "posts"}
                classname="cursor-pointer"
              >
                Posts
              </SidebarItem>
            </Link>
          )}
          {user.user.isAdmin && (
            <Link to="/dashboard?tab=users">
              <SidebarItem
                icon={HiUser}
                active={tab == "users"}
                classname="cursor-pointer"
              >
                Users
              </SidebarItem>
            </Link>
          )}
          <SidebarItem icon={HiArrowSmRight} classname="cursor-pointer">
            SignOut
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
};

export default DashSidebar;
