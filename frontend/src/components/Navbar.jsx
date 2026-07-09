import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHardHat, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--white)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="container"
        style={{
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "var(--blue-deep)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            <FaHardHat />
          </span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem", color: "var(--navy)" }}>
            GLOBAL INDUSTRIAL JOB
          </span>
        </Link>

        <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Link to="/" style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--text)" }}>
            Home
          </Link>
          {user && user.role === "user" && (
            <>
              <Link to="/dashboard" style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--text)" }}>
                Dashboard
              </Link>
              <Link to="/profile" style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--text)" }}>
                Profile
              </Link>
            </>
          )}
          {user && user.role === "admin" && (
            <Link to="/admin/dashboard" style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--text)" }}>
              Admin Panel
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              Logout
            </button>
          )}
        </nav>

        <button
          className="mobile-toggle"
          onClick={() => setOpen(!open)}
          style={{ display: "none", background: "none", border: "none", fontSize: 22, color: "var(--navy)" }}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {open && (
        <div className="container" style={{ paddingBottom: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          {user && user.role === "user" && (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
            </>
          )}
          {user && user.role === "admin" && (
            <Link to="/admin/dashboard" onClick={() => setOpen(false)}>Admin Panel</Link>
          )}
          {!user ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
