import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// User Pages
import Home from "./Home";
import Products from "./Products";
import ProductDetails from "./ProductDetails";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Orders from "./Orders";
import Wishlist from "./Wishlist";
import Rentals from "./Rentals";
import Login from "./Login";
import Signup from "./Signup";

// Admin Pages
import AdminDashboard from "./AdminDashboard";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminMaintenance from "./AdminMaintenance";
import AdminDelivery from "./AdminDelivery";
import AdminUsers from "./AdminUsers";
import AdminDamage from "./AdminDamage";
import Analytics from "./components/Analytics";

import Profile from "./Profile";
import NotFound from "./NotFound";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />



        {/* ================= USER ROUTES ================= */}

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/orders" element={<Orders />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/rentals" element={<Rentals />} />

        <Route path="/profile" element={<Profile />} />



        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />

        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />

        <Route
          path="/admin/delivery"
          element={<AdminDelivery />}
        />

        <Route
          path="/admin/maintenance"
          element={<AdminMaintenance />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

        <Route path="/admin/damage" element={<AdminDamage />} />

        <Route path="/analytics" element={<Analytics />} />



        {/* ================= 404 PAGE ================= */}

        <Route path="*" element={<NotFound />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;