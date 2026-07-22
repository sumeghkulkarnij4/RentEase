import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Package, ShoppingBag, Users, Wrench, AlertTriangle, 
  TrendingUp, Plus, ArrowRight, Check
} from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";
import { motion } from "framer-motion";
import "./styles/admin.css";

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Delivered": return "badge badge-success";
    case "Shipped":
    case "Active":   return "badge badge-info";
    case "Cancelled": return "badge badge-danger";
    default:         return "badge badge-warning";
  }
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, ordersRes] = await Promise.all([
        fetch("http://localhost:5000/api/dashboard/analytics"),
        fetch("http://localhost:5000/api/orders/admin/all"),
      ]);
      const analyticsData = await analyticsRes.json();
      const ordersData = await ordersRes.json();
      setAnalytics(analyticsData);
      setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 6) : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Total Products", value: analytics?.totalProducts ?? 0, icon: Package, color: "var(--info)", bg: "var(--info-bg)" },
    { label: "Total Orders", value: analytics?.totalOrders ?? 0, icon: ShoppingBag, color: "var(--success)", bg: "var(--success-bg)" },
    { label: "Active Rentals", value: analytics?.activeOrders ?? 0, icon: TrendingUp, color: "var(--warning)", bg: "var(--warning-bg)" },
    { label: "Registered Users", value: analytics?.totalUsers ?? 0, icon: Users, color: "#a78bfa", bg: "rgba(167,139,250,0.15)" },
    { label: "Total Revenue", value: `₹${(analytics?.revenue ?? 0).toLocaleString("en-IN")}`, icon: TrendingUp, color: "var(--success)", bg: "var(--success-bg)" },
    { label: "Maintenance Requests", value: analytics?.pendingMaintenance ?? 0, icon: Wrench, color: "var(--warning)", bg: "var(--warning-bg)" },
    { label: "Damage Claims", value: analytics?.pendingClaims ?? 0, icon: AlertTriangle, color: "var(--danger)", bg: "var(--danger-bg)" },
  ];

  const quickActions = [
    { label: "Add Product", icon: Plus, path: "/admin/products", color: "var(--info)", bg: "var(--info-bg)" },
    { label: "View Orders", icon: ShoppingBag, path: "/admin/orders", color: "var(--success)", bg: "var(--success-bg)" },
    { label: "Manage Users", icon: Users, path: "/admin/users", color: "#a78bfa", bg: "rgba(167,139,250,0.15)" },
    { label: "Maintenance", icon: Wrench, path: "/admin/maintenance", color: "var(--warning)", bg: "var(--warning-bg)" },
    { label: "Damage Claims", icon: AlertTriangle, path: "/admin/damage", color: "var(--danger)", bg: "var(--danger-bg)" },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        {/* TOPBAR */}
        <div className="admin-topbar">
          <div className="admin-topbar-title">
            <h1>Dashboard Overview</h1>
            <p>{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div className="admin-topbar-actions">
            <button
              onClick={() => navigate("/admin/products")}
              className="btn-premium btn-primary"
              style={{ padding: "10px 20px", fontSize: "14px" }}
            >
              <Plus size={16} /> Add Product
            </button>
          </div>
        </div>

        <div className="admin-page-content">
          {loading ? (
            <div className="full-page-loader">
              <span className="spinner"></span>
              <p>Loading dashboard data...</p>
            </div>
          ) : (
            <>
              {/* STATS GRID */}
              <div className="admin-stats-grid">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="admin-stat-card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <div className="admin-stat-icon" style={{ background: stat.bg, color: stat.color }}>
                      <stat.icon size={24} />
                    </div>
                    <div className="admin-stat-value">{stat.value}</div>
                    <div className="admin-stat-label">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* QUICK ACTIONS */}
              <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "16px" }}>Quick Actions</h2>
              <div className="quick-actions-grid" style={{ marginBottom: "40px" }}>
                {quickActions.map((action) => (
                  <Link key={action.path} to={action.path} className="quick-action-card">
                    <div className="quick-action-icon" style={{ background: action.bg, color: action.color }}>
                      <action.icon size={24} />
                    </div>
                    <span>{action.label}</span>
                  </Link>
                ))}
              </div>

              {/* RECENT ORDERS TABLE */}
              <div className="data-table-container">
                <div className="data-table-header">
                  <h2>Recent Orders</h2>
                  <Link to="/admin/orders" className="btn-premium btn-secondary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                    View All <ArrowRight size={14} />
                  </Link>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Status</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                            No orders found
                          </td>
                        </tr>
                      ) : (
                        recentOrders.map((order, index) => (
                          <tr key={order._id || index}>
                            <td style={{ fontFamily: "monospace", fontWeight: "700", fontSize: "13px" }}>
                              #{(order._id || "").slice(-8).toUpperCase()}
                            </td>
                            <td style={{ fontWeight: "600", color: "var(--text)" }}>
                              {order.address?.fullName || order.userName || "—"}
                            </td>
                            <td style={{ maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {(order.items || []).map(i => i.name).join(", ") || "—"}
                            </td>
                            <td>
                              <span className={getStatusBadgeClass(order.status || "Pending")}>
                                {order.status || "Pending"}
                              </span>
                            </td>
                            <td style={{ fontWeight: "700", color: "var(--text)" }}>
                              ₹{(order.total || order.totalAmount || 0).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
