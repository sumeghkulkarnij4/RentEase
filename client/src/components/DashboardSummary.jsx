import React from "react";

function DashboardSummary({ analytics }) {
  if (!analytics) {
    return null;
  }

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <h3>Total Revenue</h3>

        <h2>
          ₹
          {analytics.revenue?.toLocaleString() ||
            0}
        </h2>
      </div>

      <div className="summary-card">
        <h3>Total Users</h3>

        <h2>
          {analytics.totalUsers}
        </h2>
      </div>

      <div className="summary-card">
        <h3>Total Products</h3>

        <h2>
          {analytics.totalProducts}
        </h2>
      </div>

      <div className="summary-card">
        <h3>Total Orders</h3>

        <h2>
          {analytics.totalOrders}
        </h2>
      </div>

      <div className="summary-card">
        <h3>Active Rentals</h3>

        <h2>
          {analytics.activeOrders}
        </h2>
      </div>

      <div className="summary-card">
        <h3>Pending Maintenance</h3>

        <h2>
          {analytics.pendingMaintenance}
        </h2>
      </div>

      <div className="summary-card">
        <h3>Damage Claims</h3>

        <h2>
          {analytics.pendingClaims}
        </h2>
      </div>
    </div>
  );
}

export default DashboardSummary;