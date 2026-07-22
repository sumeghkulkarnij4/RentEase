import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Calendar, Clock, Wrench, RefreshCw, Package } from "lucide-react";
import { motion } from "framer-motion";
import "./styles/postpurchase.css";

function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please login to view rentals");
      navigate("/login");
      return;
    }

    const userId = user._id || user.id;
    fetch(`http://localhost:5000/api/orders/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const active = Array.isArray(data)
          ? data.filter((o) => o.status === "Active" || o.status === "Shipped")
          : [];
        setRentals(active);
      })
      .catch((err) => {
        console.error(err);
        setRentals([]);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const calcDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const calcDaysTotal = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const handleRequestMaintenance = async (order) => {
    const issue = window.prompt("Briefly describe the issue you're facing:");
    if (!issue) return;

    try {
      const res = await fetch("http://localhost:5000/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id,
          userId: order.userId,
          productName: order.items?.[0]?.name || "Unknown",
          issue,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Maintenance request submitted!");
      } else {
        toast.error(data.message || "Failed to submit request");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="postpurchase-page">
        <div className="container">
          <div className="full-page-loader">
            <span className="spinner"></span>
            <p>Loading your rentals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="postpurchase-page">
      <div className="container">

        <div className="page-header">
          <h1>Active Rentals</h1>
          <p>Manage your ongoing rentals, request maintenance, and track usage.</p>
        </div>

        {rentals.length === 0 ? (
          <div className="empty-state">
            <Package size={64} />
            <h2 className="h2-premium" style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>No Active Rentals</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
              You don't have any active rentals right now. Start renting today!
            </p>
            <button onClick={() => navigate("/products")} className="btn-premium btn-primary">
              Browse Collection
            </button>
          </div>
        ) : (
          <div>
            {rentals.map((order, index) => {
              const items = order.items || [];
              const firstItem = items[0];
              const daysRemaining = calcDaysRemaining(order.rentalEndDate);
              const daysTotal = calcDaysTotal(order.rentalStartDate, order.rentalEndDate);
              const progressPct = daysTotal && daysRemaining != null
                ? Math.max(0, Math.min(100, ((daysTotal - daysRemaining) / daysTotal) * 100))
                : null;

              return (
                <motion.div
                  key={order._id || index}
                  className="card-premium rental-card-premium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <div className="rental-card-body">
                    {/* PRODUCT IMAGE */}
                    {firstItem && (
                      <img
                        src={firstItem.image?.startsWith("http")
                          ? firstItem.image
                          : `http://localhost:5000/images/${firstItem.image}`}
                        alt={firstItem.name}
                        className="rental-img"
                      />
                    )}

                    {/* RENTAL INFO */}
                    <div className="rental-info">
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                        <h3 className="rental-name">{firstItem?.name || "Rental"}</h3>
                        <span className="badge badge-info">{order.status}</span>
                      </div>

                      <div className="rental-meta">
                        {order.rentalStartDate && (
                          <div className="rental-meta-item">
                            <Calendar size={16} />
                            <span>Started: {new Date(order.rentalStartDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                          </div>
                        )}
                        {order.rentalEndDate && (
                          <div className="rental-meta-item">
                            <Calendar size={16} />
                            <span>Ends: {new Date(order.rentalEndDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                          </div>
                        )}
                        {firstItem?.tenure && (
                          <div className="rental-meta-item">
                            <Clock size={16} />
                            <span>Tenure: {firstItem.tenure} Months</span>
                          </div>
                        )}
                        {firstItem?.rent && (
                          <div className="rental-meta-item">
                            <span style={{ fontWeight: "700", color: "var(--primary)" }}>₹{firstItem.rent}/month</span>
                          </div>
                        )}
                      </div>

                      {/* DAYS REMAINING PROGRESS BAR */}
                      {progressPct !== null && (
                        <div className="days-remaining">
                          <div className="days-remaining-header">
                            <span style={{ color: "var(--text-secondary)" }}>Rental Progress</span>
                            <span style={{ color: daysRemaining < 10 ? "var(--danger)" : "var(--primary)" }}>
                              {daysRemaining} days remaining
                            </span>
                          </div>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${progressPct}%`,
                                background: daysRemaining < 10
                                  ? "var(--danger)"
                                  : "linear-gradient(90deg, var(--primary), #6366f1)"
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* EXTRA ITEMS IF MULTIPLE */}
                      {items.length > 1 && (
                        <p style={{ marginTop: "12px", fontSize: "13px", color: "var(--text-muted)" }}>
                          + {items.length - 1} more item{items.length - 1 > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CARD FOOTER */}
                  <div className="rental-card-footer">
                    <button
                      onClick={() => toast.info("Renewal feature coming soon!")}
                      className="btn-premium btn-secondary"
                      style={{ padding: "10px 20px", fontSize: "14px" }}
                    >
                      <RefreshCw size={16} /> Extend Rental
                    </button>
                    <button
                      onClick={() => handleRequestMaintenance(order)}
                      className="btn-premium btn-ghost"
                      style={{ padding: "10px 20px", fontSize: "14px", border: "1px solid var(--border)" }}
                    >
                      <Wrench size={16} /> Request Maintenance
                    </button>
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

export default Rentals;