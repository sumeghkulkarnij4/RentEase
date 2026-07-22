import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Wrench,
  AlertTriangle, Truck, BarChart2, Sun, Moon, LogOut, User
} from "lucide-react";
import "../styles/admin.css";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Products", icon: Package, path: "/admin/products" },
  { label: "Orders", icon: ShoppingBag, path: "/admin/orders" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Maintenance", icon: Wrench, path: "/admin/maintenance" },
  { label: "Damage Claims", icon: AlertTriangle, path: "/admin/damage" },
  { label: "Delivery", icon: Truck, path: "/admin/delivery" },
  { label: "Analytics", icon: BarChart2, path: "/analytics" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="admin-sidebar">
      {/* LOGO */}
      <Link to="/admin/dashboard" className="sidebar-logo">
        <div className="logo-icon" style={{ width: "36px", height: "36px", fontSize: "16px" }}>R</div>
        <div>
          <div className="sidebar-brand text-gradient">RentEase</div>
          <div className="sidebar-subtitle">Admin Panel</div>
        </div>
      </Link>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Main</div>
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={path} to={path} className={`sidebar-nav-item ${isActive ? "active" : ""}`}>
              <Icon size={18} strokeWidth={2} />
              {label}
            </Link>
          );
        })}

        <div className="sidebar-section-title" style={{ marginTop: "24px" }}>Settings</div>
        <button onClick={toggleTheme} className="sidebar-nav-item" style={{ width: "100%", border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}>
          {theme === "dark" ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <Link to="/" className="sidebar-nav-item">
          <Package size={18} strokeWidth={2} />
          View Store
        </Link>
        <button onClick={handleLogout} className="sidebar-nav-item danger" style={{ width: "100%", border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}>
          <LogOut size={18} strokeWidth={2} />
          Log Out
        </button>
      </nav>

      {/* FOOTER USER INFO */}
      <div className="sidebar-footer">
        <div className="sidebar-user-mini">
          <div className="sidebar-user-avatar">
            <User size={20} />
          </div>
          <div className="sidebar-user-info">
            <p>{user.name || "Admin"}</p>
            <span>{user.email || ""}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
