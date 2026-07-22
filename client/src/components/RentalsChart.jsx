import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function RentalsChart() {

  const [data, setData] = useState([]);

  useEffect(() => {

    fetchRentals();

  }, []);

  const fetchRentals = async () => {

    const res = await fetch(
      `${API_BASE_URL}/api/dashboard/monthly`
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

    setData(

      result.map((item) => ({

        month: months[item._id.month],

        rentals: item.rentals,

      }))

    );

  };

  return (

    <ResponsiveContainer width="100%" height={300}>

      <BarChart data={data}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="rentals"
          fill="#16a34a"
        />

      </BarChart>

    </ResponsiveContainer>

  );

}

export default RentalsChart;