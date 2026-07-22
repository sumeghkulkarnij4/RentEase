import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminSidebar from "./components/AdminSidebar";
import { API_BASE_URL } from "./config/api";
import "./styles/admin.css";

function AdminDamage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/damage`
      );

      const data = await res.json();

      setClaims(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {

      const customer =
        claim.customerName || "";

      const product =
        claim.productName || "";

      const searchMatch =
        customer
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        product
          .toLowerCase()
          .includes(search.toLowerCase());

      const statusMatch =
        status === "All" ||
        claim.status === status;

      return searchMatch && statusMatch;
    });
  }, [claims, search, status]);

  const updateClaim = async (
    id,
    payload
  ) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/damage/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data =
        await res.json();

      toast.success(
        data.message ||
          "Claim Updated"
      );

      fetchClaims();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteClaim = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete this claim?"
      )
    )
      return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/damage/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await res.json();

      toast.success(data.message || "Claim deleted.");

      fetchClaims();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        Loading Damage Claims...
      </div>
    );
  }
    return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">
            <h1>Damage Claims</h1>
            <p>Review customer reports, assess repair costs, and approve/reject damage claims.</p>
          </div>
        </div>
        <div className="admin-page-content">
          <div className="admin-page">

      {/* Header */}

      <div className="admin-header">

        <h1>Damage Claims</h1>

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
          <option value="All">All Claims</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

      </div>

      {/* Claims Table */}

      <table className="admin-table">

        <thead>

          <tr>

            <th>Image</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Description</th>
            <th>Status</th>
            <th>Compensation</th>
            <th>Remarks</th>
            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {filteredClaims.map((claim) => (

            <tr key={claim._id}>

              {/* Damage Image */}

              <td>

                <img
                  src={`${API_BASE_URL}/uploads/${claim.image}`}
                  alt="Damage"
                  className="damage-image"
                />

              </td>

              {/* Customer */}

              <td>

                <strong>
                  {claim.customerName}
                </strong>

                <br />

                <small>
                  {claim.phone}
                </small>

              </td>

              {/* Product */}

              <td>
                {claim.productName}
              </td>

              {/* Description */}

              <td
                style={{
                  maxWidth: "220px",
                }}
              >
                {claim.description}
              </td>

              {/* Status */}

              <td>

                <select
                  value={
                    claim.status ||
                    "Pending"
                  }
                  onChange={(e) =>
                    updateClaim(
                      claim._id,
                      {
                        status:
                          e.target.value,
                      }
                    )
                  }
                >
                  <option>
                    Pending
                  </option>

                  <option>
                    Approved
                  </option>

                  <option>
                    Rejected
                  </option>

                </select>

              </td>

              {/* Compensation */}

              <td>

                <input
                  type="number"
                  defaultValue={
                    claim.compensation ||
                    0
                  }
                  onBlur={(e) =>
                    updateClaim(
                      claim._id,
                      {
                        compensation:
                          Number(
                            e.target
                              .value
                          ),
                      }
                    )
                  }
                  style={{
                    width: "100px",
                  }}
                />

              </td>

              {/* Remarks */}

              <td>

                <textarea
                  defaultValue={
                    claim.adminRemarks ||
                    ""
                  }
                  rows="3"
                  onBlur={(e) =>
                    updateClaim(
                      claim._id,
                      {
                        adminRemarks:
                          e.target
                            .value,
                      }
                    )
                  }
                />

              </td>

              {/* Actions */}

              <td>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteClaim(
                      claim._id
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

      {filteredClaims.length === 0 && (

        <div className="empty-state">
          No damage claims found.
        </div>

      )}

    </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDamage;
