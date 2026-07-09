import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiGrid, FiFileText, FiCreditCard, FiUser, FiLogOut, FiHome } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
    isActive ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-primary-50"
  }`;

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const adminLinks = [
    { to: "/admin", icon: <FiGrid />, label: "Dashboard" },
    { to: "/admin/notices", icon: <FiFileText />, label: "Manage Notices" },
    { to: "/admin/payments", icon: <FiCreditCard />, label: "Pending Payments" },
  ];

  const userLinks = [
    { to: "/dashboard", icon: <FiHome />, label: "Dashboard" },
    { to: "/profile", icon: <FiUser />, label: "Profile" },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen p-4 flex flex-col">
      <div className="mb-8 px-2">
        <h1 className="text-lg font-bold text-primary-700 leading-tight">
          GLOBAL INDUSTRIAL<br />JOB
        </h1>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end className={linkClass}>
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
      >
        <FiLogOut /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
