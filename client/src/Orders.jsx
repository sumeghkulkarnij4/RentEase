import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Package, Search, Check, Download, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import "./styles/postpurchase.css";

const STEPS = ["Pending", "Active", "Shipped", "Delivered"];

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Delivered": return "badge badge-success";
    case "Shipped":
    case "Active":   return "badge badge-info";
    case "Cancelled": return "badge badge-danger";
    default:         return "badge badge-warning";
  }
};

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please login to view orders");
      navigate("/login");
      return;
    }
    const userId = user._id || user.id;
    if (userId) {
      fetchOrders(userId);
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/user/${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}/cancel`, {
        method: "PUT"
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Order cancelled successfully.");
        const user = JSON.parse(localStorage.getItem("user"));
        fetchOrders(user._id || user.id);
      } else {
        toast.error(data.message || "Failed to cancel order.");
      }
    } catch (err) {
      toast.error("Network error while cancelling order.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const items = order.items || [];
    const itemNames = items.map(i => i.name || "").join(" ");
    const matchesSearch =
      itemNames.toLowerCase().includes(search.toLowerCase()) ||
      (order._id || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" ? true : (order.status || "Pending") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="postpurchase-page">
        <div className="container">
          <div className="full-page-loader">
            <span className="spinner"></span>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="postpurchase-page">
      <div className="container">

        <div className="page-header">
          <h1>My Orders</h1>
          <p>Track and manage all your furniture rental orders in one place.</p>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
            <Search size={16} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              className="input-premium"
              placeholder="Search by product or order ID..."
              style={{ paddingLeft: "40px", paddingTop: "12px", paddingBottom: "12px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-bar" style={{ margin: 0, flexWrap: "nowrap" }}>
            {["All", "Pending", "Active", "Shipped", "Delivered", "Cancelled"].map(s => (
              <button
                key={s}
                className={`filter-pill ${statusFilter === s ? "active" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ORDERS LIST */}
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <Package size={64} />
            <h2 className="h2-premium" style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>No orders found</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
              {orders.length === 0 ? "You haven't placed any orders yet." : "No orders match your search."}
            </p>
            <Link to="/products" className="btn-premium btn-primary">Browse Collection</Link>
          </div>
        ) : (
          <div>
            {filteredOrders.map((order, index) => {
              const items = order.items || [];
              const stepIndex = STEPS.indexOf(order.status || "Pending");
              const isCancelled = order.status === "Cancelled";

              return (
                <motion.div
                  key={order._id || index}
                  className="card-premium order-card-premium"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  {/* CARD HEADER */}
                  <div className="order-card-header">
                    <div className="order-meta">
                      <span className={getStatusBadgeClass(order.status || "Pending")}>
                        {order.status || "Pending"}
                      </span>
                      <span className="order-id">#{(order._id || "").slice(-8).toUpperCase()}</span>
                      {order.createdAt && (
                        <span className="order-date">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                    <div style={{ fontWeight: "800", fontSize: "18px", color: "var(--text)" }}>
                      ₹{(order.total || order.totalAmount || 0).toLocaleString("en-IN")}
                    </div>
                  </div>

                  {/* CARD BODY */}
                  <div className="order-card-body">
                    {items.length > 0 ? (
                      <div className="order-items-list">
                        {items.map((item, i) => (
                          <div key={i} className="order-item-row">
                            <img
                              src={item.image?.startsWith("http") ? item.image : `http://localhost:5000/images/${item.image}`}
                              alt={item.name}
                              className="order-item-img"
                              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300"; }}
                            />
                            <div className="order-item-details">
                              <h4>{item.name}</h4>
                              <p>₹{item.rent}/month × {item.quantity || 1} · {item.tenure} Months</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="order-item-row">
                        <div className="order-item-details">
                          <h4>{order.name || "Rental Order"}</h4>
                          <p>₹{order.rent || 0}/month</p>
                        </div>
                      </div>
                    )}

                    {/* TRACKING TIMELINE */}
                    {!isCancelled && (
                      <div className="tracking-timeline">
                        {STEPS.map((step, i) => {
                          const isDone = i < stepIndex;
                          const isCurrent = i === stepIndex;
                          return (
                            <div key={step} className={`track-node ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}>
                              <div className="track-dot">
                                {(isDone || isCurrent) && <Check size={14} strokeWidth={3} />}
                              </div>
                              <span className="track-label">{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* CARD FOOTER */}
                  <div className="order-card-footer">
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", fontSize: "13px", color: "var(--text-secondary)" }}>
                      {order.address?.street && (
                        <span>📍 {order.address.street}, {order.address.city}</span>
                      )}
                      {order.paymentMethod && (
                        <span>💳 {order.paymentMethod}</span>
                      )}
                    </div>
                    <div className="order-actions-row">
                      {order.status === "Pending" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="btn-premium btn-ghost"
                          style={{ color: "var(--danger)", borderColor: "var(--danger-bg)", padding: "8px 14px", fontSize: "13px" }}
                        >
                          <XCircle size={14} /> Cancel Order
                        </button>
                      )}
                      {items.length > 0 && (
                        <Link
                          to={`/product/${items[0]?.productId || items[0]?._id}`}
                          className="btn-premium btn-secondary"
                          style={{ padding: "8px 16px", fontSize: "13px" }}
                        >
                          View Item
                        </Link>
                      )}
                      <button
                        onClick={() => toast.info("Receipt downloaded successfully.")}
                        className="btn-premium btn-ghost"
                        style={{ padding: "8px 16px", fontSize: "13px", border: "1px solid var(--border)" }}
                      >
                        <Download size={14} /> Invoice
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default Orders;