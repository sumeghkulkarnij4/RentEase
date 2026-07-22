import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import "../styles/analytics.css";

import RevenueChart from "../components/RevenueChart";
import RentalsChart from "../components/RentalsChart";
import CategoryChart from "../components/CategoryChart";
import TopProducts from "../components/TopProducts";
import DashboardSummary from "../components/DashboardSummary";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/dashboard/analytics`
      );

      const data = await res.json();

      setAnalytics(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    window.print();
  };

  const exportCSV = () => {
    let csv = "Metric,Value\n";

    csv += `Revenue,${analytics.revenue}\n`;
    csv += `Users,${analytics.totalUsers}\n`;
    csv += `Orders,${analytics.totalOrders}\n`;
    csv += `Products,${analytics.totalProducts}\n`;
    csv += `Active Rentals,${analytics.activeOrders}\n`;
    csv += `Maintenance,${analytics.pendingMaintenance}\n`;
    csv += `Damage Claims,${analytics.pendingClaims}\n`;

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "analytics.csv";

    link.click();
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        Loading Analytics...
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>

        <p>Overview of RentEase Performance</p>
      </div>

      <div className="analytics-toolbar">
        <div className="date-filter">
          <input
            type="date"
            value={fromDate}
            onChange={(e) =>
              setFromDate(e.target.value)
            }
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) =>
              setToDate(e.target.value)
            }
          />

          <button>
            Apply Filter
          </button>
        </div>

        <div>
          <button
            onClick={exportPDF}
            className="pdf-btn"
          >
            Export PDF
          </button>

          <button
            onClick={exportCSV}
            className="excel-btn"
          >
            Export CSV
          </button>
        </div>
      </div>

      <DashboardSummary analytics={analytics} />

      <div className="growth-grid">
        <div className="growth-card">
          <h3>Revenue Growth</h3>

          <h2
            style={{
              color: "green",
            }}
          >
            +18%
          </h2>
        </div>

        <div className="growth-card">
          <h3>User Growth</h3>

          <h2
            style={{
              color: "green",
            }}
          >
            +12%
          </h2>
        </div>

        <div className="growth-card">
          <h3>Rental Growth</h3>

          <h2
            style={{
              color: "green",
            }}
          >
            +9%
          </h2>
        </div>

        <div className="growth-card">
          <h3>Customer Satisfaction</h3>

          <h2
            style={{
              color: "green",
            }}
          >
            ★ 4.8
          </h2>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h2>Revenue</h2>

          <RevenueChart />
        </div>

        <div className="analytics-card">
          <h2>Monthly Rentals</h2>

          <RentalsChart />
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h2>Category Distribution</h2>

          <CategoryChart />
        </div>

        <div className="analytics-card">
          <h2>Top Rated Products</h2>

          <TopProducts />
        </div>
      </div>
    </div>
  );
}

export default Analytics;