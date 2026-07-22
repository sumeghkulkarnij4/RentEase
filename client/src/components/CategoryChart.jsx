import React, { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#ca8a04",
  "#9333ea",
];

function CategoryChart() {

  const [data, setData] = useState([]);

  useEffect(() => {

    fetchCategories();

  }, []);

  const fetchCategories = async () => {

    const res = await fetch(
      "http://localhost:5000/api/dashboard/categories"
    );

    const result = await res.json();

    setData(

      result.map((item) => ({

        name: item._id,

        value: item.count,

      }))

    );

  };

  return (

    <ResponsiveContainer width="100%" height={300}>

      <PieChart>

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
        >

          {data.map((entry, index) => (

            <Cell
              key={index}
              fill={
                COLORS[index % COLORS.length]
              }
            />

          ))}

        </Pie>

        <Tooltip />

      </PieChart>

    </ResponsiveContainer>

  );

}

export default CategoryChart;