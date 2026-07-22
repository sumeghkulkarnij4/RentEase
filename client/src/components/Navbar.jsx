import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { 
  Search, Sun, Moon, ShoppingBag, Heart, 
  User, Menu, X, LogOut, ChevronDown 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/components.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ];

  return (
    <header className={`navbar-header ${isScrolled ? "scrolled glass-panel" : ""}`}>
      <div className="container nav-container">
        
        {/* LOGO */}
        <Link to="/" className="nav-logo">
          <div className="logo-icon">R</div>
          <span className="logo-text text-gradient">RentEase</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="nav-desktop hide-mobile">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="nav-link">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="nav-actions hide-mobile">
          <button className="btn-icon" onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={20} strokeWidth={2.5} />
          </button>

          <button className="btn-icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
          </button>

          {user ? (
            <div className="nav-user-section">
              <Link to="/wishlist" className="btn-icon"><Heart size={20} strokeWidth={2.5} /></Link>
              <Link to="/cart" className="btn-icon"><ShoppingBag size={20} strokeWidth={2.5} /></Link>
              
              <div className="user-dropdown-wrapper">
                <button className="user-dropdown-trigger">
                  <User size={18} strokeWidth={2.5} />
                  <span className="truncate-name">{user.name.split(" ")[0]}</span>
                  <ChevronDown size={16} className="text-muted" />
                </button>

                <div className="user-dropdown-menu glass-panel">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                  </div>
                  
                  {isAdmin && (
                    <Link to="/admin/dashboard" className="dropdown-item text-accent">Dashboard</Link>
                  )}
                  <Link to="/profile" className="dropdown-item">My Profile</Link>
                  <Link to="/orders" className="dropdown-item">My Orders</Link>
                  <Link to="/rentals" className="dropdown-item">Active Rentals</Link>
                  
                  <div className="dropdown-divider" />
                  
                  <button onClick={handleLogout} className="dropdown-item text-danger">
                    <LogOut size={16} strokeWidth={2.5} /> Log out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="nav-auth-section">
              <Link to="/login" className="btn-ghost nav-auth-btn">Log in</Link>
              <Link to="/signup" className="btn-primary nav-auth-btn">Sign up</Link>
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="nav-mobile-buttons hide-desktop">
          <button className="btn-icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="btn-icon bg-secondary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* SEARCH BAR EXPANSION */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="search-expansion"
          >
            <form onSubmit={handleSearch} className="search-form">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                autoFocus
                placeholder="Search for furniture, appliances, electronics..." 
                className="input-premium search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="search-close-btn">
                <X size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE FULL SCREEN MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu-overlay"
          >
            <div className="mobile-menu-content">
              
              <form onSubmit={handleSearch} className="mobile-search-form">
                <Search className="search-icon" size={20} />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="input-premium mobile-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              <nav className="mobile-nav-links">
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} className="mobile-nav-link">
                    {link.name}
                  </Link>
                ))}
              </nav>

              {user ? (
                <div className="mobile-user-section">
                  <div className="mobile-user-header">
                    <div className="mobile-user-avatar"><User size={24} /></div>
                    <div>
                      <h3 className="mobile-user-name">{user.name}</h3>
                      <p className="mobile-user-email">{user.email}</p>
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <Link to="/admin/dashboard" className="mobile-menu-item text-accent bg-secondary">
                      Dashboard
                    </Link>
                  )}
                  
                  <div className="mobile-menu-grid">
                    <Link to="/profile" className="mobile-grid-item">
                      <User size={24} /> <span>Profile</span>
                    </Link>
                    <Link to="/orders" className="mobile-grid-item">
                      <ShoppingBag size={24} /> <span>Orders</span>
                    </Link>
                    <Link to="/wishlist" className="mobile-grid-item">
                      <Heart size={24} /> <span>Wishlist</span>
                    </Link>
                    <Link to="/rentals" className="mobile-grid-item">
                      <ShoppingBag size={24} /> <span>Rentals</span>
                    </Link>
                  </div>

                  <button onClick={handleLogout} className="mobile-logout-btn">
                    <LogOut size={20} /> Log out
                  </button>
                </div>
              ) : (
                <div className="mobile-auth-section">
                  <Link to="/login" className="btn-secondary mobile-auth-btn">Log in</Link>
                  <Link to="/signup" className="btn-primary mobile-auth-btn">Sign up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;