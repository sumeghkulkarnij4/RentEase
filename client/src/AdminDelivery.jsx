import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "./components/AdminSidebar";
import "./styles/admin.css";

function AdminDelivery() {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    fetch("http://localhost:5000/api/orders/admin/all")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updatePickupStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${id}/pickup`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pickupStatus: status,
          }),
        }
      );

      const data = await res.json();

      toast.success(data.message || "Pickup status updated.");

      loadOrders();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">
            <h1>Delivery & Pickup Dashboard</h1>
            <p>Track courier assignments, pickup schedules, and delivery fulfillment status.</p>
          </div>
        </div>
        <div className="admin-page-content">
          <div className="admin-page">

      {orders.length === 0 ? (
        <h3>No Deliveries Found</h3>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="checkout-item"
            style={{
              display: "block",
              marginBottom: "20px",
              padding: "20px",
            }}
          >
            <h3>{order.address?.fullName}</h3>

            <p>
              <strong>Phone:</strong> {order.address?.phone}
            </p>

            <p>
              <strong>City:</strong> {order.address?.city}
            </p>

            <hr />

            <h4>Products</h4>

            {order.items.map((item, index) => (
              <p key={index}>
                {item.name} ({item.quantity})
              </p>
            ))}

            <hr />

            <p>
              <strong>Delivery Partner:</strong>{" "}
              {order.deliveryPartner || "Not Assigned"}
            </p>

            <p>
              <strong>Pickup Date:</strong>{" "}
              {order.pickupDate || "Not Assigned"}
            </p>

            <p>
              <strong>Pickup Status:</strong>{" "}
              <span style={{ color: "blue" }}>
                {order.pickupStatus}
              </span>
            </p>

            <hr />

            <button
              onClick={() =>
                updatePickupStatus(order._id, "Started")
              }
            >
              Start Pickup
            </button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() =>
                updatePickupStatus(order._id, "Picked Up")
              }
            >
              Picked Up
            </button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() =>
                updatePickupStatus(order._id, "Completed")
              }
            >
              Completed
            </button>
          </div>
        ))
      )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDelivery;
