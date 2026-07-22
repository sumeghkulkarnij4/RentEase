import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminSidebar from "./components/AdminSidebar";
import "./styles/admin.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/orders/admin/all"
      );

      const data = await res.json();

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customer =
        order.address?.fullName || "";

      const searchMatch =
        customer
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        order._id
          .toLowerCase()
          .includes(search.toLowerCase());

      const statusMatch =
        status === "All" ||
        order.status === status;

      return searchMatch && statusMatch;
    });
  }, [orders, search, status]);

  const updateStatus = async (id, value) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: value,
          }),
        }
      );

      const data = await res.json();

      toast.success(
        data.message ||
          "Updated Successfully"
      );

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const updatePayment = async (
    id,
    value
  ) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${id}/payment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentStatus: value,
          }),
        }
      );

      const data = await res.json();

      toast.success(data.message || "Payment status updated.");

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const updateDelivery = async (
    id,
    value
  ) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${id}/delivery`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deliveryStatus: value,
          }),
        }
      );

      const data = await res.json();

      toast.success(data.message || "Delivery status updated.");

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteOrder = async (id) => {
    if (
      !window.confirm(
        "Delete this order?"
      )
    )
      return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      toast.success(data.message || "Order deleted.");

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">
            <h1>Order Management</h1>
            <p>Monitor customer orders, update order status, payment status, and track deliveries.</p>
          </div>
        </div>
        <div className="admin-page-content">
          <div className="admin-page">

  {/* Header */}

  <div className="admin-header">

    <h1>Order Management</h1>

    <Link
      to="/admin"
      className="back-btn"
    >
      ← Dashboard
    </Link>

  </div>

  {/* Filters */}

  <div className="admin-filters">

    <input
      type="text"
      placeholder="Search by Customer or Order ID..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
    />

    <select
      value={status}
      onChange={(e) =>
        setStatus(e.target.value)
      }
    >
      <option value="All">All Orders</option>
      <option value="Pending">Pending</option>
      <option value="Active">Active</option>
      <option value="Delivered">Delivered</option>
      <option value="Cancelled">Cancelled</option>
    </select>

  </div>

  {/* Orders Table */}

  <table className="admin-table">

    <thead>

      <tr>

        <th>Order ID</th>
        <th>Customer</th>
        <th>Phone</th>
        <th>Total</th>
        <th>Order Status</th>
        <th>Payment Method</th>
        <th>Payment Status</th>
        <th>Transaction ID</th>
        <th>Delivery</th>
        <th>Actions</th>

      </tr>

    </thead>

    <tbody>

      {filteredOrders.map((order) => (

        <tr key={order._id}>

          <td>{order._id.slice(-6)}</td>

          <td>

            <strong>

              {order.address?.fullName}

            </strong>

            <br />

            <small>

              {order.address?.street},{" "}

              {order.address?.city}

            </small>

          </td>

          <td>

            {order.address?.phone}

          </td>

          <td>

            ₹{order.total}

          </td>

          {/* Order Status */}

          <td>

            <select
              value={order.status || "Pending"}
              onChange={(e) =>
                updateStatus(
                  order._id,
                  e.target.value
                )
              }
            >

              <option>Pending</option>
              <option>Active</option>
              <option>Delivered</option>
              <option>Cancelled</option>

            </select>

          </td>

          {/* Payment Method */}

          <td>

            {order.paymentMethod || "Cash on Delivery"}

          </td>

          {/* Payment Status */}

          <td>

            <select
              value={
                order.paymentStatus ||
                "Pending"
              }
              onChange={(e) =>
                updatePayment(
                  order._id,
                  e.target.value
                )
              }
            >

              <option>Pending</option>
              <option>Paid</option>
              <option>Refunded</option>

            </select>

          </td>

          {/* Transaction ID */}

          <td>

            {order.paymentId ? (

              <span
                style={{
                  color: "green",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >

                {order.paymentId}

              </span>

            ) : (

              <span
                style={{
                  color: "#888",
                }}
              >

                N/A

              </span>

            )}

          </td>

          {/* Delivery */}

          <td>

            <select
              value={
                order.deliveryStatus ||
                "Pending"
              }
              onChange={(e) =>
                updateDelivery(
                  order._id,
                  e.target.value
                )
              }
            >

              <option>Pending</option>
              <option>Shipped</option>
              <option>Delivered</option>

            </select>

          </td>

          {/* Actions */}

          <td>

            <button
              className="delete-btn"
              onClick={() =>
                deleteOrder(order._id)
              }
            >

              Delete

            </button>

          </td>

        </tr>

      ))}

    </tbody>
      </table>

  {filteredOrders.length === 0 && (

    <div className="empty-state">

      No orders found.

    </div>

  )}

  <div
    style={{
      marginTop: "20px",
      padding: "15px",
      background: "#f8f9fa",
      borderRadius: "10px",
      border: "1px solid #ddd",
    }}
  >

    <h3>Order Summary</h3>

    <p>
      <strong>Total Orders:</strong>{" "}
      {filteredOrders.length}
    </p>

    <p>
      <strong>Pending:</strong>{" "}
      {
        filteredOrders.filter(
          (o) => o.status === "Pending"
        ).length
      }
    </p>

    <p>
      <strong>Active:</strong>{" "}
      {
        filteredOrders.filter(
          (o) => o.status === "Active"
        ).length
      }
    </p>

    <p>
      <strong>Delivered:</strong>{" "}
      {
        filteredOrders.filter(
          (o) => o.status === "Delivered"
        ).length
      }
    </p>

    <p>
      <strong>Cancelled:</strong>{" "}
      {
        filteredOrders.filter(
          (o) => o.status === "Cancelled"
        ).length
      }
    </p>

    <p>
      <strong>Paid Orders:</strong>{" "}
      {
        filteredOrders.filter(
          (o) =>
            o.paymentStatus === "Paid"
        ).length
      }
    </p>

    <p>
      <strong>Pending Payments:</strong>{" "}
      {
        filteredOrders.filter(
          (o) =>
            o.paymentStatus ===
            "Pending"
        ).length
      }
    </p>

  </div>

  </div>
        </div>
      </main>
    </div>
  );
}

export default AdminOrders;
