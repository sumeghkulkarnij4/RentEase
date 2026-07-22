import React, { useEffect, useState } from "react";

function TopProducts() {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    fetchProducts();

  }, []);

  const fetchProducts = async () => {

    const res = await fetch(
      "http://localhost:5000/api/dashboard/top-products"
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