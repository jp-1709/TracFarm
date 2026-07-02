import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  Sprout,
  Sun,
  Moon,
  LogOut,
  Compass,
  PlusCircle,
  Layers,
  Bot,
  User,
  Shield,
  Menu,
  X
} from "lucide-react";
import "../styles/Navbar.css";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // Don't show navbar on login/register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleBrandClick = () => {
    if (user?.role === "farmer") navigate("/farmer-dashboard");
    else if (user?.role === "admin") navigate("/admin-dashboard");
    else if (user?.role === "distributor") navigate("/distributor-dashboard");
    else if (user?.role === "retailer") navigate("/retailer-dashboard");
    else if (user?.role === "customer") navigate("/customer-dashboard");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Side: Brand Logo */}
        <div className="navbar-brand" onClick={handleBrandClick}>
          <div className="brand-logo-wrapper">
            <Sprout className="brand-icon-svg" size={24} />
          </div>
          <span className="brand-name">TracFarm</span>
        </div>

        {/* Center: Desktop Menu */}
        {user && (
          <div className="navbar-menu">
            {user.role === "farmer" && (
              <>
                <Link
                  to="/farmer-dashboard"
                  className={`nav-link ${isActive("/farmer-dashboard")}`}
                >
                  <Layers size={16} />
                  <span>Products</span>
                </Link>
                <Link
                  to="/add-product"
                  className={`nav-link ${isActive("/add-product")}`}
                >
                  <PlusCircle size={16} />
                  <span>Add Product</span>
                </Link>
              </>
            )}

            {user.role === "distributor" && (
              <>
                <Link
                  to="/distributor-dashboard"
                  className={`nav-link ${isActive("/distributor-dashboard")}`}
                >
                  <Layers size={16} />
                  <span>Orders</span>
                </Link>
              </>
            )}

            {user.role === "retailer" && (
              <>
                <Link
                  to="/retailer-dashboard"
                  className={`nav-link ${isActive("/retailer-dashboard")}`}
                >
                  <Layers size={16} />
                  <span>Inventory</span>
                </Link>
              </>
            )}

            {user.role === "customer" && (
              <>
                <Link
                  to="/customer-dashboard"
                  className={`nav-link ${isActive("/customer-dashboard")}`}
                >
                  <Compass size={16} />
                  <span>Marketplace</span>
                </Link>
                <button
                  onClick={() =>
                    window.dispatchEvent(new Event("openAIQualityCheck"))
                  }
                  className="nav-link nav-btn-link"
                >
                  <Bot size={16} />
                  <span>AI Quality Check</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Right Side: Actions */}
        {user && (
          <div className="navbar-actions">
            {user.role === "admin" && (
              <Link to="/admin-dashboard" className="nav-btn nav-btn-admin">
                <Shield size={16} />
                <span>Admin</span>
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="nav-btn-theme-toggle"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="user-profile-badge">
              <div className="avatar-wrapper">
                <User size={16} />
              </div>
              <div className="profile-details">
                <span className="profile-name">{user.name || user.email?.split("@")[0]}</span>
                <span className="profile-role">{user.role}</span>
              </div>
            </div>

            <button onClick={handleLogout} className="logout-button-icon" title="Logout">
              <LogOut size={18} />
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-trigger"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {user && mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in-up">
          <div className="mobile-drawer-links">
            {user.role === "farmer" && (
              <>
                <Link
                  to="/farmer-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-link ${isActive("/farmer-dashboard")}`}
                >
                  <Layers size={18} />
                  <span>Products</span>
                </Link>
                <Link
                  to="/add-product"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-link ${isActive("/add-product")}`}
                >
                  <PlusCircle size={18} />
                  <span>Add Product</span>
                </Link>
              </>
            )}

            {user.role === "distributor" && (
              <Link
                to="/distributor-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`mobile-link ${isActive("/distributor-dashboard")}`}
              >
                <Layers size={18} />
                <span>Orders</span>
              </Link>
            )}

            {user.role === "retailer" && (
              <Link
                to="/retailer-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`mobile-link ${isActive("/retailer-dashboard")}`}
              >
                <Layers size={18} />
                <span>Inventory</span>
              </Link>
            )}

            {user.role === "customer" && (
              <>
                <Link
                  to="/customer-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-link ${isActive("/customer-dashboard")}`}
                >
                  <Compass size={18} />
                  <span>Marketplace</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.dispatchEvent(new Event("openAIQualityCheck"));
                  }}
                  className="mobile-link mobile-btn-link"
                >
                  <Bot size={18} />
                  <span>AI Quality Check</span>
                </button>
              </>
            )}

            {user.role === "admin" && (
              <Link
                to="/admin-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-link admin-link"
              >
                <Shield size={18} />
                <span>Admin Panel</span>
              </Link>
            )}

            <button onClick={handleLogout} className="mobile-logout-btn">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
