import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

function TopProducts() {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    fetchProducts();

  }, []);

  const fetchProducts = async () => {

    const res = await fetch(
      `${API_BASE_URL}/api/dashboard/top-products`
    );

    const data = await res.json();

    setProducts(data);

  };

  return (

    <div>

      {products.map((product) => (

        <div
          key={product._id}
          className="top-product"
        >

          <strong>
            {product.name}
          </strong>

          <br />

          ⭐ {product.rating}

          <hr />

        </div>

      ))}

    </div>

  );

}

export default TopProducts;