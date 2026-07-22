import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminSidebar from "./components/AdminSidebar";
import "./styles/admin.css";

function AdminMaintenance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/maintenance"
      );

      const data = await res.json();

      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {

      const product =
        item.productName || "";

      const customer =
        item.customerName || "";

      const matchesSearch =
        product
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        customer
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "All" ||
        item.status === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [requests, search, status]);

  const updateStatus = async (
    id,
    value
  ) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/maintenance/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status: value,
          }),
        }
      );

      const data = await res.json();

      alert(
        data.message ||
          "Status Updated"
      );

      fetchRequests();
    } catch (err) {
      console.log(err);
    }
  };

  const assignTechnician =
    async (id, name) => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/maintenance/${id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              assignedTo: name,
            }),
          }
        );

        const data =
          await res.json();

        toast.success(
          data.message ||
            "Technician Assigned"
        );

        fetchRequests();
      } catch (err) {
        console.log(err);
      }
    };

  const deleteRequest =
    async (id) => {
      if (
        !window.confirm(
          "Delete this request?"
        )
      )
        return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/maintenance/${id}`,
          {
            method: "DELETE",
          }
        );

        const data =
          await res.json();

        toast.success(data.message || "Request deleted.");

        fetchRequests();
      } catch (err) {
        console.log(err);
      }
    };

  if (loading) {
    return (
      <div className="admin-loading">
        Loading Maintenance...
      </div>
    );
  }
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">
            <h1>Maintenance Management</h1>
            <p>Track service requests, assign technicians, and monitor completion progress.</p>
          </div>
        </div>
        <div className="admin-page-content">
          <div className="admin-page">

      {/* Header */}

      <div className="admin-header">

        <h1>Maintenance Management</h1>

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
          placeholder="Search by customer or product..."
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
          <option value="All">All Requests</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

      </div>

      {/* Maintenance Table */}

      <table className="admin-table">

        <thead>

          <tr>

            <th>Customer</th>

            <th>Product</th>

            <th>Issue</th>

            <th>Technician</th>

            <th>Status</th>

            <th>Date</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {filteredRequests.map((request) => (

            <tr key={request._id}>

              <td>

                <strong>
                  {request.customerName}
                </strong>

                <br />

                <small>
                  {request.phone}
                </small>

              </td>

              <td>
                {request.productName}
              </td>

              <td
                style={{
                  maxWidth: "250px",
                }}
              >
                {request.description}
              </td>

              {/* Technician */}

              <td>

                <select
                  value={
                    request.assignedTo || ""
                  }
                  onChange={(e) =>
                    assignTechnician(
                      request._id,
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select
                  </option>

                  <option>
                    Ravi
                  </option>

                  <option>
                    Ajay
                  </option>

                  <option>
                    Mohan
                  </option>

                  <option>
                    Suresh
                  </option>

                </select>

              </td>

              {/* Status */}

              <td>

                <select
                  value={
                    request.status ||
                    "Pending"
                  }
                  onChange={(e) =>
                    updateStatus(
                      request._id,
                      e.target.value
                    )
                  }
                >
                  <option>
                    Pending
                  </option>

                  <option>
                    Assigned
                  </option>

                  <option>
                    In Progress
                  </option>

                  <option>
                    Completed
                  </option>

                </select>

              </td>

              <td>

                {new Date(
                  request.createdAt
                ).toLocaleDateString()}

              </td>

              <td>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteRequest(
                      request._id
                    )
                  }
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {filteredRequests.length === 0 && (

        <div className="empty-state">
          No maintenance requests found.
        </div>

      )}

    </div>
        </div>
      </main>
    </div>
  );
}

export default AdminMaintenance;
