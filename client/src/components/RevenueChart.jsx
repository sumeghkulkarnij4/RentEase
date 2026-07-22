import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function RevenueChart() {

  const [data, setData] = useState([]);

  useEffect(() => {

    fetchRevenue();

  }, []);

  const fetchRevenue = async () => {

    try {

      const res = await fetch(
        `${API_BASE_URL}/api/dashboard/revenue`
      );

      const result = await res.json();

      const months = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const formatted = result.map((item) => ({
        month: months[item._id.month],
        revenue: item.revenue,
      }));

      setData(formatted);

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <ResponsiveContainer width="100%" height={300}>

      <LineChart data={data}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#2563eb"
          strokeWidth={3}
        />

      </LineChart>

    </ResponsiveContainer>

  );

}

export default RevenueChart;