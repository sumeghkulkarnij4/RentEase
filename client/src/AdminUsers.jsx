import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminSidebar from "./components/AdminSidebar";
import "./styles/admin.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "user",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/users"
      );

      const data = await res.json();

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return (
        user.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [users, search]);

  const handleEdit = (user) => {
    setEditing(user._id);

    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      role: user.role || "user",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const cancelEdit = () => {
    setEditing(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      role: "user",
    });
  };

  const saveUser = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${editing}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      toast.success(
        data.message ||
          "User Updated Successfully"
      );

      cancelEdit();

      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (id) => {
    if (
      !window.confirm(
        "Delete this user?"
      )
    )
      return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      toast.success(data.message || "User deleted.");

      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        Loading Users...
      </div>
    );
  }
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">
            <h1>User Management</h1>
            <p>View registered accounts, manage user roles, and update contact information.</p>
          </div>
        </div>
        <div className="admin-page-content">
          <div className="admin-page">

      {/* Header */}

      <div className="admin-header">

        <h1>User Management</h1>

        <Link
          to="/admin"
          className="back-btn"
        >
          ← Dashboard
        </Link>

      </div>

      {/* Edit Form */}

      {editing && (

        <div className="admin-form">

          <h2>Edit User</h2>

          <div className="form-grid">

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              disabled
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">
                User
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

          </div>

          <textarea
            name="address"
            placeholder="Address"
            rows="4"
            value={form.address}
            onChange={handleChange}
          />

          <div className="form-actions">

            <button
              onClick={saveUser}
            >
              Save Changes
            </button>

            <button
              className="cancel-btn"
              onClick={cancelEdit}
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      {/* Search */}

      <div className="admin-filters">

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* Users Table */}

      <table className="admin-table">

        <thead>

          <tr>

            <th>Name</th>

            <th>Email</th>

            <th>Phone</th>

            <th>Role</th>

            <th>Address</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {filteredUsers.map((user) => (

            <tr key={user._id}>

              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>
                {user.phone || "-"}
              </td>

              <td>

                <span
                  className={
                    user.role === "admin"
                      ? "role-admin"
                      : "role-user"
                  }
                >
                  {user.role}
                </span>

              </td>

              <td>
                {user.address || "-"}
              </td>

              <td>

                <button
                  className="edit-btn"
                  onClick={() =>
                    handleEdit(user)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteUser(user._id)
                  }
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {filteredUsers.length === 0 && (

        <div className="empty-state">
          No users found.
        </div>

      )}

    </div>
        </div>
      </main>
    </div>
  );
}

export default AdminUsers;
